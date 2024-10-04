import { View, Text, StyleSheet, Image } from 'react-native'
import React, { FC } from 'react'
import ScalePress from '../ui/ScalePress'
import { navigate } from '../../utils/NavigationUtils'
import CustomText from '../ui/CustomText'
import { Fonts } from '../../utils/Constants'

const CategoryContainer : FC<{data: any}> = ({data}) => {
    const renderItems = (items: any[]) => {
        return (
            <>{items.map((item, index) => {
            return(
                <ScalePress key={index} onPress={() => navigate('ProductCategories', {_id: item?.id, categoryName: item?.name})} style={styles.item }>
                    <View style={styles.imageContainer}>
                        <Image source={item.image} style={styles.image}/>
                    </View>
                    <CustomText style={styles.text} variant='h8' fontFamily={Fonts.Medium}>{item.name}</CustomText>
                </ScalePress>
            )
        })}</>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {renderItems(data?.slice(0,4))}
            </View>
            <View style={styles.row}>
                {renderItems(data?.slice(4, 8))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginVertical: 15,
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 25
    },
    image:{
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    text:{
        textAlign: 'center'
    },
    item:{
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer:{
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 6,
        backgroundColor: "#E5F3F3" 
    },

})

export default CategoryContainer