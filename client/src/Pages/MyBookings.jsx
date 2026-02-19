import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";


const MyBookings = () => {

  const { axios, user , currency} = useAppContext()
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([])

  const fetchMyBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/booking/user')
      if(data.success) {
        setBookings(data.bookings)
      }else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    user && fetchMyBookings()
  },[user])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title='My Bookings'
      subTitle='View and manage your all product bookings'
      align="left" />

      <div>
        {bookings.map((booking, index)=>(
          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            {/* Product Image + Info */}
            <div className='mt:col-span'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.product.image} alt="" className='w-full h-auto aspect-video object-cover'/>

              </div>
              <p className='text-lg font-medium mt-2'>{booking.product.name}</p>

              <p className='text-gray-500'>{booking.product.location}</p>
            </div>

            {/* Booking Info*/}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rouded'>Booking #{index+1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div >
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{booking.rentalStartDate.split('T')[0]} To { booking.rentalEndDate.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div >
                  <p className='text-gray-500'>Product Location</p>
                  <p>{booking.product.location}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="md:col-span-1 flex flex-col items-end gap-3">
             <div className="text-sm text-gray-500 text-right">
              <p>Total Price</p>
              <h1 className="text-2xl font-semibold text-primary">
              {currency}{booking.price}
              </h1>
              <p>Booked on {booking.createdAt.split("T")[0]}</p>
             </div>

             {booking.paymentStatus === "paid" ? (
             <button className="px-4 py-2 bg-green-500 text-white rounded" disabled> PAID </button>
             ) : (
             <button onClick={() => navigate(`/dummy-payment/${booking._id}?amount=${booking.price}`)}
             className="px-4 py-2 bg-primary text-white rounded"> Pay Now </button> )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings

