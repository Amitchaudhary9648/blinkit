import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import CustomHeader from '../../components/ui/CustomHeader'
import { Colors } from '../../utils/Constants'
import Sidebar from './Sidebar'
import { getAllCategories, getProductsByCategoryId } from '../../service/productService'
import ProductList from './ProductList'
import { withCart } from '../cart/WithCart'

const ProductCategories: FC<{route: any}> = ({route}) => {
    const { _id, categoryName } = route.params;
    const [categories, setCategories] = useState<any[]>()
    const [selectedCategory, setSelectedCategory] = useState<any>({_id, name: categoryName})
    const [products, setProducts] = useState<any[]>([])
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>()
    const [productsLoading, setProductsLoading] = useState<boolean>()

    const fetchCategories = async () => {
        setCategoriesLoading(true)
        try {
            const data = await getAllCategories()
            console.log("Response from getAllCategories", data)
            setCategories(data)
            if (data && data.length < 0) {
                setCategories([0])
            }
        } catch (error) {
            console.log("Error fetching categories", error)
        } finally {
            setCategoriesLoading(false)
        }
    }

    const fetchProducts = async (categoryId: string) => {
        setProductsLoading(true)
        try {
            const data = await getProductsByCategoryId(categoryId)
            setProducts(data)
        } catch (error) {
            console.log("Error fetching products", error)
        } finally {
            setProductsLoading(false)
        }
    }
    useEffect(() => {
        fetchCategories()
    },[])

    useEffect(() => {
        if(selectedCategory?._id){
            fetchProducts(selectedCategory?._id)
        }
    }, [selectedCategory])
    return (
        <View style={styles.mainContainer}>
            <CustomHeader title={selectedCategory?.name || "Categories"} search={true} />
            <View style={styles.subContainer}>
                {
                    categoriesLoading ? (<ActivityIndicator size={'small'} color={Colors.border} />)
                        : (
                            <Sidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryPress={(category: any) => setSelectedCategory(category)} />
                        )
                }
                {
                    productsLoading ? (<ActivityIndicator size={'small'} color={Colors.border} style={styles.center} />)
                        : (
                            <ProductList data={products || []}/>
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default withCart(ProductCategories)