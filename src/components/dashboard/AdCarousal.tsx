import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import { screenHeight, screenWidth } from '../../utils/Scaling'
import Carousel from 'react-native-reanimated-carousel'
import { Image } from 'react-native'
import ScalePress from '../ui/ScalePress'

const AdCarousal: FC<{adData: any}> = ({adData}) => {
    const progressValue = useSharedValue(0)
    const baseOptions = {
        vertical: false,
        width: screenWidth,
        height: screenWidth * 0.5
    }
    const onPress = () => {

    }
    return (
        <View style={{left: -20, marginVertical: 20}}>
            <Carousel 
                {...baseOptions}
                loop
                pagingEnabled
                snapEnabled
                autoPlay
                autoPlayInterval={3000}
                mode='parallax'
                data={adData}
                modeConfig={{
                    parallaxScrollingOffset: 0,
                    parallaxScrollingScale: 0.94
                }}
                renderItem={({item}: any) => {
                    return(
                        <ScalePress onPress={onPress} style={styles.imageContainer}>
                        <Image 
                            source={item}
                            style={styles.img}/>
                        </ScalePress>
                    )
                }}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: '100%'
    },
    img:{
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20
    }
})

export default AdCarousal