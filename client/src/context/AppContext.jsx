import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();

export const AppProvider = ({children})=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const[isOwner, setIsOwner] = useState(false)
    const[showLogin, setShowLogin] = useState(false)
    const [rentalStartDate, setRentalStartDate] = useState('')
    const [rentalEndDate, setRentalEndDate] = useState('')

    const[products, setProducts] = useState([])
    

    // Function to check if user is logged in
    const fetchUser = async()=>{
        try {
         const {data} =   await axios.get('/api/user/data')
         if(data.success){
            setUser(data.user)
            setIsOwner(data.user)
            setIsOwner(data.user.role === 'owner')
         } else {
            navigate('/')
         }
        } catch (error){
            toast.error(error.message)

        }
    }

    // Function to fetch all products from the server
    const fetchProducts = async()=>{
        try{
            const {data} = await axios.get('/api/user/products')
            data.success ? setProducts(data.products) : toast.error(data.message)
        } catch(error) {
            toast.error(error.message)
        }
    }

    // Function to log out the user
    const logout= ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('You have been logged out')
    }

    // useEffect to retrieve the token from localStorage
    useEffect(()=>{
       const token = localStorage.getItem('token')
       setToken(token) 
       fetchProducts()
    }, [])

    // useEffect to fetch user data when token is available
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
        }
    },[token])

    const value = {
        navigate, currency, axios, user, setUser, token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchProducts, products, setProducts, rentalStartDate, setRentalStartDate, rentalEndDate, setRentalEndDate

    }

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}

