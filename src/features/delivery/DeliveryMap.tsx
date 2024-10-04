import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useAuthStore } from '../../state/authStore';
import { confirmOrder, getOrderById, sendLiveOrderUpdates } from '../../service/orderService';
import { Colors } from '../../utils/Constants';
import CustomText from '../../components/ui/CustomText';
import OrderSummary from '../map/OrderSummary';
import DeliveryDetails from '../map/DeliveryDetails';
import Geolocation from "@react-native-community/geolocation";
import LiveHeader from '../map/LiveHeader';
import LiveMap from '../map/LiveMap';
import { useRoute } from '@react-navigation/native';
import { hocStyles } from '../../styles/GlobalStyles';
import CustomButton from '../../components/ui/CustomButton';
import { goBack } from '../../utils/NavigationUtils';

const DeliveryMap: FC = () => {
    const user = useAuthStore(state => state.user);
    const [orderData, setOrderData] = useState<any>(null);
    const [myLocation, setMyLocation] = useState<any>(null);
    const route = useRoute();
    const { setCurrentOrder } = useAuthStore();

    // Fetch order details
    const fetchOrderDetails = async () => {
        try {
            const data = await getOrderById(route?.params?._id as any);
            setOrderData(data);
        } catch (error) {
            console.log("Error fetching order by id", error);
        }
    };

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setMyLocation({ latitude, longitude });
            },
            error => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }

    // Get current location and track location updates
    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMyLocation({ latitude, longitude });
                console.log("Location updated:", { latitude, longitude });
            },
            (err) => console.log("Error fetching GeoLocation", err),
            { enableHighAccuracy: true, distanceFilter: 2 }
        );

        return () => Geolocation.clearWatch(watchId); // Clear watcher on component unmount
    }, []);

    // Fetch order details when component mounts
    useEffect(() => {
        fetchOrderDetails();
        getLocation()
    }, []);

    const acceptOrder = async () => {
        const data = await confirmOrder(orderData?._id, myLocation);
        if (data) {
            setCurrentOrder(data);
            Alert.alert("Order Accepted, Grab your package");
        } else {
            Alert.alert("There was an error");
        }
        fetchOrderDetails();
    };

    const orderPickedUp = async () => {
        const data = await sendLiveOrderUpdates(orderData?._id, myLocation, "arriving");
        if (data) {
            setCurrentOrder(data);
            Alert.alert("Let's deliver it as soon as possible");
        } else {
            Alert.alert("There was an error");
        }
        fetchOrderDetails();
    };

    const orderDelivered = async () => {
        const data = await sendLiveOrderUpdates(orderData?._id, myLocation, "delivered");
        if (data) {
            setCurrentOrder(null);
            Alert.alert("Woohoo! You made it🥳");
            goBack();
        } else {
            Alert.alert("There was an error");
        }
        fetchOrderDetails();
    };

    let message = "Start this order";
    if (orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'confirmed') {
        message = "Grab your order";
    } else if (orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'arriving') {
        message = "Complete your order";
    } else if (orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'delivered') {
        message = "Your milestone";
    } else if (orderData?.deliveryPartner?._id == user?._id && orderData?.status != 'available') {
        message = "You missed it!";
    }

    return (
        <View style={styles.container}>
            <LiveHeader type="Delivery" title={message} secondTitle={"Delivery in 10 minutes"} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <LiveMap
                    deliveryPersonLocation={orderData?.deliveryPersonLocation || myLocation}
                    deliveryLocation={orderData?.deliveryLocation || null}
                    hasAccepted={orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'confirmed'}
                    hasPickedUp={orderData?.status == 'arriving'}
                    pickupLocation={orderData?.pickupLocation || null} />
                <DeliveryDetails details={orderData?.customer} />
                <OrderSummary order={orderData} />
                <CustomText variant='h6' style={{ opacity: 0.6, marginTop: 20 }}>
                    Blinkit
                </CustomText>
            </ScrollView>
            {orderData?.status != 'delivered' && orderData?.status != 'cancelled' && (
                <View style={[hocStyles.cartContainer, styles.btnContainer]}>
                    {orderData?.status == 'available' && (
                        <CustomButton
                            disabled={false}
                            title={'Accept Order'}
                            onPress={acceptOrder}
                            loading={false}
                        />
                    )}
                    {orderData?.status == 'confirmed' && orderData?.deliveryPartner?._id == user?._id && (
                        <CustomButton
                            disabled={false}
                            title={'Order Picked Up'}
                            onPress={orderPickedUp}
                            loading={false}
                        />
                    )}
                    {orderData?.status == 'arriving' && orderData?.deliveryPartner?._id == user?._id && (
                        <CustomButton
                            disabled={false}
                            title={'Delivered'}
                            onPress={orderDelivered}
                            loading={false}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    btnContainer: {
        padding: 10
    },
    scrollContent: {
        paddingBottom: 150,
        backgroundColor: Colors.backgroundSecondary,
        padding: 15
    }
});

export default DeliveryMap;
