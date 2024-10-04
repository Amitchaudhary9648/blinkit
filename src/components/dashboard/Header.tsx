import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { FC, useEffect } from 'react'
import CustomText from '../ui/CustomText'
import { Fonts } from '../../utils/Constants'
import { RFValue } from 'react-native-responsive-fontsize'
import { useAuthStore } from '../../state/authStore'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { navigate } from '../../utils/NavigationUtils'
import Geolocation from '@react-native-community/geolocation'
import { reverseGeocode } from '../../service/mapService'

const Header: FC<{ showNotice: () => void }> = ({ showNotice }) => {
    const { user, setUser } = useAuthStore()

    const updateUserLocation = async () => {
        Geolocation.requestAuthorization()
        Geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords
                reverseGeocode(latitude, longitude, setUser)
            },
            error => console.log(error),
            {
                enableHighAccuracy: false,
                timeout: 10000
            }
        )
    }

    useEffect(() => {
        updateUserLocation()
    },[])
    return (
        <View style={styles.subContainer}>
            <TouchableOpacity
                activeOpacity={0.8}>
                <CustomText style={styles.text} variant='h8' fontFamily={Fonts.Bold}>
                    Delivery in
                </CustomText>
                <View style={styles.flexRowGap}>
                    <CustomText variant='h2' fontFamily={Fonts.SemiBold} style={styles.text}>
                        10 minutes
                    </CustomText>
                    <TouchableOpacity style={styles.noticeBtn} onPress={showNotice}>
                        <CustomText fontSize={RFValue(5)} fontFamily={Fonts.SemiBold} style={{ color: '#3B4886' }}>⛈️ Rain</CustomText>
                    </TouchableOpacity>
                </View>
                <View style={styles.flexRow}>
                    <CustomText variant='h8' numberOfLines={1} fontFamily={Fonts.Medium} style={styles.text2}>
                        {user?.address || "nowhere, somewhere 😅"}
                    </CustomText>
                    <Icon name='menu-down' color={'#fff'} size={RFValue(20)} style={{ bottom: -1 }} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate("Profile")}>
                <Icon name={'account-circle-outline'} size={RFValue(36)} color={"#fff"} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: Platform.OS == 'android' ? 10 : 5,
        justifyContent: 'space-between'
    },
    text: {
        color: '#fff',
    },
    text2: {
        color: '#fff',
        width: '90%',
        textAlign: 'center'
    },
    flexRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        width: '70%'
    },
    flexRowGap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    noticeBtn: {
        backgroundColor: '#E8EAF5',
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 2,
        bottom: -2
    }
})

export default Header