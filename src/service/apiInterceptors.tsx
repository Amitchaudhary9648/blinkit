import axios from "axios";
import { BASE_URL } from "./config";
import { tokenStorage } from "../state/storage";
import { refresh_tokens } from "./authService";
import { Alert } from "react-native";

export const appAxios = axios.create({
    baseURL: BASE_URL
})

appAxios.interceptors.request.use(async config => {
    const accessToken = tokenStorage.getString("accessToken")
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

appAxios.interceptors.response.use(
    response => response,
    async error => {
        if(error.response && error.response.status == 401){
            try{
                const new_access_token = await refresh_tokens()
                if(new_access_token){
                    error.config.headers.Authorization = `Bearer ${new_access_token}`
                    return axios(error.config)
                }
            } catch(error){
                console.log("ERROR REFRESHING TOKEN")
            }
        }
        if(error.response && error.response.status != 401){
            const errorMessage = error.response.data.message || "something went wrong"
            Alert.alert(errorMessage) 
        }
        Promise.resolve(error)
    }
)