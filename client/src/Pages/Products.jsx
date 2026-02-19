import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext} from '../context/AppContext'

const Products = () => {

// getting search params from url
const [searchParams] = useSearchParams()
const Location = searchParams.get('Location')
const rentalStartDate = searchParams.get('rentalStartDate')
const rentalEndDate = searchParams.get('rentalEndDate')

const {products, axios} = useAppContext()

const [input, setInput] = useState('')

const isSearchData = Location && rentalStartDate && rentalEndDate
const [filteredProducts, setFilteredProducts] = useState([])

const applyFilter = async ()=>{
  if(input === '') {
    setFilteredProducts(products)
    return null
  } 
  const filtered = products.slice().filter((product)=>{
    return product.name.toLowerCase().includes(input.toLowerCase()) 
    || product.category.toLowerCase().includes(input.toLowerCase())
  })
  setFilteredProducts(filtered)
}

const searchProductAvailablity = async()=>{
  const {data} = await axios.post('/api/bookings/check-availability', {location: Location, rentalStartDate, rentalEndDate})
  if(data.success) {
    setFilteredProducts(data.availableProducts)
    if(data.availableProducts.length === 0){
      toast('No products available')
    }  
    return null  
  } 
}

useEffect(()=>{
  isSearchData && searchProductAvailablity()
},[])

useEffect(()=>{
  products.length > 0 && !isSearchData && applyFilter()
},[input, products])

  return (
    <div> 
      <div className='flex flex-col items-center py-20 bg-[rgb(216,245,252)] max-md:px-4'>
        <Title title='Available Products' subTitle='Browse our selection of premium products available for you' />

        <div className='flex items-center bg-white px-4 mt-6 max-w-130 w-full h-12 rounded-full shadow'>

          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search Product' className='w-full h-full outline-none text-gray-500'/>

        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredProducts.length} Products</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredProducts.map((product, index ) => (
            <div key={index}>
              <ProductCard product={product} />
              </div>
          ))}
        </div>
      </div>  
    </div>
  )
}

export default Products
