import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { Colors, Fonts } from '../../utils/Constants';
import CustomText from '../ui/CustomText';

interface TabBarProps {
    selectedTab: 'available' | 'delivered';
    onTabChange: (tab: 'available' | 'delivered') => void
}
const TabBar: FC<TabBarProps> = ({selectedTab, onTabChange}) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => onTabChange('available')} activeOpacity={0.8} 
                style={[styles.tab, selectedTab == 'available' && styles.activeTab]}>
                <CustomText
                    variant='h8'
                    fontFamily={Fonts.SemiBold}
                    style={[styles.tabText, selectedTab == 'available' ? styles.activeTabText: styles.inactiveTabText]}>
                    Available
                </CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onTabChange('delivered')} activeOpacity={0.8} 
                style={[styles.tab, selectedTab != 'available' && styles.activeTab]}>
                <CustomText
                    variant='h8'
                    fontFamily={Fonts.SemiBold}
                    style={[styles.tabText, selectedTab != 'available' ? styles.activeTabText: styles.inactiveTabText]}>
                    Delivered
                </CustomText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    tabContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    tab:{
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 2,
        width: '38%',
        margin: 15,
        borderColor: Colors.border,
        alignItems: 'center'
    },
    activeTab:{
        backgroundColor: Colors.secondary,
        borderColor: Colors.backgroundSecondary
    },
    tabText:{
        color: Colors.text
    },
    activeTabText:{
        color: '#fff' 
    },
    inactiveTabText:{
        color: Colors.disabled
    }
})

export default TabBar