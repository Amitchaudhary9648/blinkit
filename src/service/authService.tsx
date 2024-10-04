import axios from "axios"
import { BASE_URL } from "./config"
import { tokenStorage } from "../state/storage"
import { useAuthStore } from "../state/authStore"
import { resetAndNavigate } from "../utils/NavigationUtils"
import { appAxios } from "./apiInterceptors"

export const customerLogin = async (phone: string) => {
    try{
        const response = await axios.post(`${BASE_URL}/customer/login`, {phone})
        const {accessToken, refreshToken, customer} = response.data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const { setUser} = useAuthStore.getState()
        setUser(customer)
        return response.data
    } catch(error){
        console.log("Login error:", error)
    }
}

export const deliveryLogin = async (email: string, password: string) => {
    try{
        const response = await axios.post(`${BASE_URL}/delivery/login`, {email, password})
        const {accessToken, refreshToken, deliveryPartner} = response.data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const { setUser} = useAuthStore.getState()
        setUser(deliveryPartner)
        return response.data
    } catch(error){
        console.log("Login error:", error)
    }
}

export const refresh_tokens = async () => {
    try{
        const refreshToken = tokenStorage.getString("refreshToken")
        const response = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken
        })
        const new_access_token = response.data.accessToken
        const new_refesh_token = response.data.refreshToken
        tokenStorage.set("refreshToken", new_refesh_token)
        tokenStorage.set("accessToken", new_access_token)
        return new_access_token
    } catch(error){
        console.log("REFRESH TOKEN ERROR:", error)
        tokenStorage.clearAll()
        resetAndNavigate('CustomerLogin')
    }
}

export const refetchUser = async (setUser: any) => {
    try{
        const response = await appAxios.get(`/user`)
        setUser(response.data.user)
    } catch(error){
        console.log("Login Error", error)
    }
}

export const updateUserLocation = async (data: any, setUser: any) => {
    try{
        const response = await appAxios.patch(`/user`, data)
        refetchUser(setUser)
    } catch(error){
        console.log("updateUserLocation error", error)
    }
}