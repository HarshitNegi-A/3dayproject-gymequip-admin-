import { createContext, useState } from "react";

const ProductContext=createContext({
    products:[],
    addProduct:()=>{},
    deleteProduct:()=>{},
    updateProduct:()=>{}
})

export const ProductProvider=()=>{

    const [products,setProducts]=useState([])

    const handleAddProduct=(product)=>{
        setProducts([...products,product])
    }
    const handleDeleteProduct=(product)=>{
        
    }
    const handleUpdateProduct=(product)=>{
        
    }
    

    const productcontext={
        products:products,
        addProduct:handleAddProduct,
        deleteProduct:handleDeleteProduct,
        updateProduct:handleUpdateProduct,
    }
}