import { appAxios } from "./apiInterceptors"
import { updateUserLocation } from "./authService";
import { GOOGLE_MAP_API } from "./config"

export const reverseGeocode = async (latitude: number, longitude: number, setUser: any) => {
    try{
        const response = await appAxios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API}`
        )
        if(response.data.status=='OK'){
            const address = response.data.results[0].formatted_address;
            console.log(response.data)
            updateUserLocation({liveLocation: {latitude, longitude}, address},setUser)
        }else{
            console.log("Geo Code Failed")
        }
    } catch(error){
        console.log("sendLiveOrder  error ", error)
    }
}