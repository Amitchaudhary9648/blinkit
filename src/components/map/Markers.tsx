import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'

const Markers = ({ deliveryLocation, pickupLocation, deliveryPersonLocation }: any) => {
    return (
        <>
            {
                deliveryLocation && <Marker
                    image={require('../../assets/icons/my_pin.png')}
                    coordinate={deliveryLocation}
                    style={{ height: 10, width: 10 }}
                />
            }
            <Marker
                image={require('../../assets/icons/store.png')}
                coordinate={pickupLocation}
                style={{ height: 10, width: 10 }}
            />
            {
                deliveryPersonLocation && <Marker
                    image={require('../../assets/icons/delivery.png')}
                    coordinate={deliveryPersonLocation}
                    style={{
                        height: 10,
                        width: 10,
                        position: 'absolute',
                        zIndex: 99
                    }}
                />
            }
        </>
    )
}

const styles = StyleSheet.create({

})

export default Markers