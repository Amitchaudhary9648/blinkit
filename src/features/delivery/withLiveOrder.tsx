import { FC, useEffect, useState } from "react"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { useAuthStore } from "../../state/authStore"
import { useNavigationState } from "@react-navigation/native"
import { getOrderById } from "../../service/orderService"
import { hocStyles } from "../../styles/GlobalStyles"
import CustomText from "../../components/ui/CustomText"
import { Colors, Fonts } from "../../utils/Constants"
import { navigate } from "../../utils/NavigationUtils"
import io from "socket.io-client"
import { SOCKET_URL } from "../../service/config"
import Geolocation from "@react-native-community/geolocation"


export const withLiveOrder = <P extends object>(WrappedComponent: React.ComponentType<P>): FC<P> => {
    const WithLiveStatusComponent: FC<P> = (props) => {
        const { currentOrder, setCurrentOrder } = useAuthStore()
        const [myLocation, setMyLocation] = useState<any>(null)

        console.log("location on hoc delivery", myLocation)

        useEffect(() => {
            const watchId = Geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords
                    setMyLocation({ latitude, longitude })
                },
                (err) => console.log("Error fetching GeoLocation", err),
                { enableHighAccuracy: true, distanceFilter: 10 }
            )
            return () => Geolocation.clearWatch(watchId)
        }, [])

        const routeName = useNavigationState(state => state.routes[state.index]?.name)
        const fetchOrderDetails = async () => {
            const data = await getOrderById(currentOrder?._id as any)
            setCurrentOrder(data)
        }


        useEffect(() => {
            if (currentOrder) {
                const socketInstance = io(SOCKET_URL, {
                    transports: ['websocket'],
                    withCredentials: false
                })
                socketInstance.emit('joinRoom', currentOrder?._id)
                socketInstance.emit('liveTrackingUpdates', (updatedOrder: any) => {
                    fetchOrderDetails()
                    console.log("RECEIVING LIVE UPDATES🔴", updatedOrder);
                })
                socketInstance.emit('orderConfirmed', (confirmOrder: any) => {
                    fetchOrderDetails()
                    console.log("ORDER CONFIRMATION LIVE UPDATES🔴", confirmOrder);
                })

                return () => {
                    socketInstance.disconnect()
                }
            }
        }, [currentOrder])
        return (
            <View style={styles.container}>
                <WrappedComponent {...props} />
                {currentOrder && routeName === "DeliveryDashboard" && (
                    <View style={[hocStyles.cartContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                        <View style={styles.flexRow}>
                            <View style={styles.img}>
                                <Image source={require('../../assets/icons/bucket.png')} style={{ width: 20, height: 20 }} />
                            </View>
                            <View style={{ width: '68%' }}>
                                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                                    Order is {currentOrder?.status}
                                </CustomText>
                                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                                    {currentOrder?.items?.[0]?.item?.name + (currentOrder?.items?.length - 1 > 0 ? ` and ${(currentOrder?.items?.length - 1)} + items` : '')}
                                </CustomText>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => navigate("LiveTracking")} style={styles.btn}>
                            <CustomText variant="h8" fontFamily={Fonts.Medium} style={{ color: Colors.secondary }}>
                                View
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }
    return WithLiveStatusComponent
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 15,
        marginBottom: 15,
        paddingVertical: 10,
        padding: 10,
    },
    img: {
        backgroundColor: Colors.secondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderWidth: 0.7,
        borderColor: Colors.secondary,
        borderRadius: 5
    }
})

export default withLiveOrder