import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import Products from './Pages/Products'
import MyBookings from './Pages/MyBookings'
import Footer from './components/Footer'
import Layout from './Pages/owner/Layout'
import Dashboard from './Pages/owner/Dashboard'
import AddProduct from './Pages/owner/AddProduct'
import ManageBookings from './Pages/owner/ManageBookings'
import ManageProducts from './Pages/owner/ManageProducts'  
import DummyPayment from './Pages/DummyPayment'      
import Login from './components/Login'
import { Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {
  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
    <Toaster />
      {showLogin &&  <Login />}
     
      {!isOwnerPath && <Navbar />}

      <Routes>  
        <Route path='/' element={<Home />} />
        <Route path='/product-details/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path="/dummy-payment/:bookingId" element={<DummyPayment />} />


        {/* Owner routes */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>

      {/* Show footer only for user side */}
      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App
