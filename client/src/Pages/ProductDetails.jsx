import React, { useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import CommentSection from '../components/CommentSection'

const ProductDetails = () => {

  const {id} = useParams()
  const {products, axios, rentalStartDate, setRentalStartDate, rentalEndDate, setRentalEndDate} = useAppContext()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/booking/create', {
        product: id, 
        rentalStartDate, 
        rentalEndDate
      })

      if(data.success) {
        toast.success(data.message)
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    setProduct(products.find(product => product._id === id))
  },[products, id])

  return product ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all products</button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* Left: Product Image & Details */}
          <div className='lg:col-span-2'>
            <img src={product.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>

            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold'>{product.name} </h1>
                <div>
                <span className='text-gray-500 text-lg'>{product.year}</span>
               </div>
                <div className='flex items-center gap-2'>
                 <img src={assets.location_icon} alt="symbol" className="w-6 h-6" />
                 <span className='text-gray-500 text-lg'>{product.location}</span>
               </div>
               
              </div>
              <hr className='border borderColor my-6'/>

              {/* Description */}
              <div>
                <h1 className='text-xl font-medium mb-3'>Description</h1>
                <p className='text-gray-500'>{product.description}</p>

                <CommentSection productId={product._id} ownerId={product.owner} />

              </div>

            </div>
          </div>

          {/* Right: Booking Form */}
          <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 spacee-y-6 text-gray-500'>
            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{product.pricePerDay}
              <span className='text-base text-gray-400 font-normal'> per day</span>
              </p>

              <hr className='border-borderColor my-6' />
              <div className='flex flex-col gap-2 my-6'>
                <label htmlFor="rental-start-date">Rental Start Date</label>
                <input value={rentalStartDate} onChange={(e)=>setRentalStartDate(e.target.value)}type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='rental-start-date' min={new Date().toISOString().split('T')[0]}/>
      
              </div>
              <div className='flex flex-col gap-2 my-6'>
                <label htmlFor="rental-end-date">Rental End Date</label>
                <input value={rentalEndDate} onChange={(e)=>setRentalEndDate(e.target.value)}type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='rental-end-date' />
              </div>

              <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>Request to Rent</button>
          </form>


        </div>
    </div>
  ) : <Loader />
}

export default ProductDetails
