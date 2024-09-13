import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useAuthStore } from '../../state/authStore'
import { confirmOrder, getOrderById, sendLiveOrderUpdates } from '../../service/orderService'
import { Colors } from '../../utils/Constants'
import CustomText from '../../components/ui/CustomText'
import OrderSummary from '../map/OrderSummary'
import DeliveryDetails from '../map/DeliveryDetails'
import Geolocation from "@react-native-community/geolocation"
import LiveHeader from '../map/LiveHeader'
import LiveMap from '../map/LiveMap'
import { useRoute } from '@react-navigation/native'
import { hocStyles } from '../../styles/GlobalStyles'
import CustomButton from '../../components/ui/CustomButton'
import { goBack } from '../../utils/NavigationUtils'


const DeliveryMap: FC = () => {
    const user = useAuthStore(state => state.user)
    const [orderData, setOrderData] = useState<any>(null)
    const [myLocation, setMyLocation] = useState<any>(null)
    const route = useRoute()

    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setMyLocation({ latitude, longitude })
            },
            (err) => console.log("Error fetching GeoLocation", err),
            { enableHighAccuracy: true, distanceFilter: 10 }
        )
        return () => Geolocation.clearWatch(watchId)
    }, [])

    const orderDetail = route?.params as Record<string, any>
    const { setCurrentOrder } = useAuthStore()

    const fetchOrderDetails = async () => {
        try {
            const data = await getOrderById(orderDetail?._id as any)
            setOrderData(data)
        } catch (error) {
            console.log("error from get order by id", error)

        }
    }

    console.log("myLocation", myLocation)

    useEffect(() => {
        fetchOrderDetails()
    }, [])

let message = "Start this order"
if (orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'confirmed') {
    message = "Grab your order"
} else if (orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'arriving') {
    message = "Complete your order"
} else if (orderData?.deliveryPartner?._id == user?._id && orderData?.status == 'delivered') {
    message = "Your milestone"
} else if (orderData?.deliveryPartner?._id == user?._id && orderData?.status != 'available') {
    message = "You missed it!"
}

// useEffect(() => {
//     async function sendLiveUpdates(){
//         if(orderData?.deliveryPartner?._id == user?._id
//             && orderData?.status != 'delivered'
//             && orderData?.status != 'cancelled'
//         ){
//             await sendLiveOrderUpdates(orderData?._id, myLocation, orderData?.status)
//         }
//     }
//     sendLiveUpdates()
// },[myLocation])

const acceptOrder = async () => {
    const data = await confirmOrder(orderData?._id, myLocation)
    if (data) {
        setCurrentOrder(data)
        Alert.alert("Order Accepted, Grab your package")
    } else {
        Alert.alert("There was an error")
    }
    fetchOrderDetails()
}
const orderPickedUp = async () => {
    const data = await sendLiveOrderUpdates(orderData?._id, myLocation, "arriving")
    if (data) {
        setCurrentOrder(data)
        Alert.alert("Let's deliver it as soon as possible")
    } else {
        Alert.alert("There was an error")
    }
    fetchOrderDetails()
}
const orderDelivered = async () => {
    const data = await sendLiveOrderUpdates(orderData?._id, myLocation, "delivered")
    if (data) {
        setCurrentOrder(data)
        Alert.alert("Woohoo! You made it🥳")
        goBack()
    } else {
        Alert.alert("There was an error")
    }
    fetchOrderDetails()
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
        {orderData?.status != 'delivered' && orderData?.status != 'cancelled' &&
            <View style={[hocStyles.cartContainer, styles.btnContainer]}>
                {orderData?.status == 'available' &&
                    <CustomButton
                        disabled={false}
                        title={'Accept Order'}
                        onPress={acceptOrder}
                        loading={false}
                    />
                }
                {orderData?.status == 'confirmed' &&
                    orderData?.deliveryPartner?._id == user?._id &&
                    <CustomButton
                        disabled={false}
                        title={'Order Picked Up'}
                        onPress={orderPickedUp}
                        loading={false}
                    />
                }
                {orderData?.status == 'arriving' &&
                    orderData?.deliveryPartner?._id == user?._id &&
                    <CustomButton
                        disabled={false}
                        title={'Delivered'}
                        onPress={orderDelivered}
                        loading={false}
                    />
                }
            </View>
        }
    </View>
)
}

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
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        borderRadius: 15,
        marginTop: 15,
        paddingVertical: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderBottomWidth: 0.7,
        borderColor: Colors.border
    },
    iconContainer: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default DeliveryMap