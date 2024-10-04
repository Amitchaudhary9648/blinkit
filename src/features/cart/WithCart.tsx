import { FC } from "react";
import { useCartStore } from "../../state/cartStore";
import { StyleSheet, View } from "react-native";
import CartAnimationWrapper from "./CartAnimationWrapper";
import CartSummary from "./CartSummary";

export const withCart = <P extends object>(WrappedComponent: React.ComponentType<P>):FC<P>=>{
    const WithCartComponent: FC<P>=(props)=> {
        const cart = useCartStore(state => state.cart)
        const cartCount = cart.reduce((acc, item) => acc + item.count, 0)
        return(
            <View style={styles.container}>
                <WrappedComponent {...props}/>
                <CartAnimationWrapper cartCount={cartCount}>
                    <CartSummary
                        cartCount={cartCount}
                        cartImage={cart![0]?.item?.image ||  require('../../assets/products/10.png')}/>
                </CartAnimationWrapper>
            </View>
        )
    }
    return WithCartComponent 
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})