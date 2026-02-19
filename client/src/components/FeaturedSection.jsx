import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useNavigate } from 'react-router-dom'
import arrow_icon from '../assets/arrow_icon.svg'
import { useAppContext } from '../context/AppContext'

// Featured section
const FeaturedSection = () => {
  const navigate = useNavigate()
  const {products} = useAppContext()

  return (
    <div className='flex flex-col items-center py-20 px-6 md:px-16 lg:px-24 xl:px-32'>
      {/* Section title */}
      <Title title='Fresh Recommendations' subTitle='Explore our selection of premium products available for you.' />

      {/* Product grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16'>
        {products.slice(0, 5).map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Button */}
      <div>
        <button
          onClick={() => {
            navigate('/products')
            scrollTo(0, 0)
          }}
          className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-16 cursor-pointer'
        >
          Explore all products <img src={arrow_icon} alt='arrow' />
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection
