import { View, Text, Alert, ScrollView } from 'react-native'
import React, { FC, useState } from 'react'
import { resetAndNavigate } from '../../utils/NavigationUtils'
import { deliveryLogin } from '../../service/authService'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { StyleSheet } from 'react-native'
import { screenWidth } from '../../utils/Scaling'
import LottieView from 'lottie-react-native'
import CustomText from '../../components/ui/CustomText'
import { Fonts } from '../../utils/Constants'
import CustomInput from '../../components/ui/CustomInput'
import Icon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomButton from '../../components/ui/CustomButton'

const DeliveryLogin: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const data = await deliveryLogin(email, password)
      console.log("data", data)
      if(data){
        resetAndNavigate('DeliveryDashboard')
      }
    } catch (error) {
      Alert.alert("Login Failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <CustomSafeAreaView>
      <ScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>
        <View style={styles.container}>

          <View style={styles.lottieContainer}>
            <LottieView autoPlay={true} loop style={styles.lottie} source={require('../../assets/animations/delivery_man.json')} />
          </View>

          <CustomText variant='h3' fontFamily={Fonts.Bold} >
            Delivery Partner Portal
          </CustomText>
          <CustomText variant='h6' style={styles.text} fontFamily={Fonts.SemiBold} >
            Faster than Flash ⚡️
          </CustomText>

          <CustomInput
            onChangeText={setEmail}
            value={email}
            left={<Icon
              name='mail'
              color={'#F8890E'}
              style={{ marginLeft: 10 }}
              size={RFValue(18)}
            />}
            placeholder='Email'
            inputMode='email'
            autoCapitalize='none'
            right={false}
          />

          <CustomInput
            onChangeText={setPassword}
            value={password}
            left={<Icon
              name='key-sharp'
              color={'#F8890E'}
              style={{ marginLeft: 10 }}
              size={RFValue(18)}
            />}
            placeholder='Password'
            secureTextEntry
            right={false}
          />

          <CustomButton 
            title="Login"
            disabled={email.length == 0 || password.length < 8}
            onPress={handleLogin}
            loading={loading}/>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center'
  },
  lottie: {
    height: '100%',
    width: '100%'
  },
  lottieContainer: {
    width: '100%',
    height: screenWidth * 0.2
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8
  }
})

export default DeliveryLogin