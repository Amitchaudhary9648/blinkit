type Location = {
    [key: string]: any
}


export const handleFitToPath = (
    mapRef: any,
    deliveryPersonLocation: any,
    pickupLocation: Location,
    deliveryLocation: Location,
    hasPickedUp: any,
    hasAccepted: any,
) => {
    if (mapRef && deliveryLocation && pickupLocation) {
        mapRef.fitToCoordinates([
            hasAccepted ? deliveryPersonLocation : deliveryLocation,
            hasPickedUp ? deliveryPersonLocation : pickupLocation
        ], {
            edgePadding: {top: 50, bottom: 50, right: 50, left: 50},
            animated: true
        })
    }
}