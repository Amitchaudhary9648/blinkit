import { appAxios } from "./apiInterceptors"

export const createOrder = async (items: any, totalPrice: number) => {
    try{
        const response = await appAxios.post('/order', {
            items: items,
            branch: '66cedc52760abae96b517f7e',
            totalPrice: totalPrice 
        })
        return response.data
    } catch(error){
        console.log("Create order error ", error)
    }
}

export const getOrderById = async (id: string) => {
    try{
        const response = await appAxios.get(`/order/${id}`)
        return response?.data
    } catch(error){
        console.log("Fetch order error ", error)
    }
}

export const fetchCustomerOrders = async (userId: string) => {
    try{
        const response = await appAxios.get(`/order?customerId=${userId}`)
        return response?.data
    } catch(error){
        console.log("Fetch Customer order error ", error)
    }
}

export const fetchOrders = async (status: string, userId: string, branchId: string) => {
    let uri = status == 'available' ? `/order?status=${status}&branchId=${branchId}` :
            `/order?branchId=${branchId}&deliverPartnerId=${userId}&status=delivered`
    try{
        const response = await appAxios.get(uri) 
        return response?.data
    } catch(error){
        console.log("Fetch Delivery order error ", error)
    }
}

export const sendLiveOrderUpdates = async (id: string, location: any, status: string) => {
    try{
        const response = await appAxios.patch(`/order/${id}/status`, {
            deliveryPersonLocation: location,
            status
        }) 
        return response?.data
    } catch(error){
        console.log("sendLiveOrder  error ", error)
    }
}

export const confirmOrder = async (id: string, location: any) => {
    console.log("location passed", location)
    try{
        const response = await appAxios.post(`/order/${id}/confirm`, {
            deliveryPartnerLocation: location,
        }) 
        return response?.data
    } catch(error){
        console.log("confirmOrder  error ", error)
    }
}