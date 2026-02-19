import React, {useState, useEffect} from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageProducts = () => {

  const {isOwner, axios, currency} = useAppContext()

  const [products, setProducts ] = useState([])

  const fetchOwnerProducts = async () =>{
    try {
      const {data} = await axios.get('/api/owner/products')
      if(data.success){
        setProducts(data.products)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

   const toggleAvailability = async (productId) =>{
    try {
      const {data} = await axios.post('/api/owner/toggle-product', {productId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerProducts()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteProduct = async (productId) =>{
    try {
      const confirm = window.confirm('Are you sure you want to delete this product?')

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-product', {productId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerProducts()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    isOwner  && fetchOwnerProducts()
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Product" subTitle="View all listed products, update their details, or remove them from the booking platform." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 mb-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium '>Product</th>
              <th className='p-3 font-medium  max-md:hidden'>Category</th>
              <th className='p-3 font-medium '>Price</th>
              <th className='p-3 font-medium max-md:hidden '>Status</th>
              <th className='p-3 font-medium '>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index)=>(
              <tr key={index} className='norder-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={product.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{product.name}</p>
                    <p className='text-xs text-gray-500'>{product.location}</p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{product.category}</td>
                <td className='p-3'>{currency}{product.pricePerDay}/day</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-100 text-green-500': 'bg-red-100 text-red-500'}`}>
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className='flex items-center py-3'>
                  <img onClick={()=> toggleAvailability(product._id)}src={product.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer'/>

                  <img onClick={()=> deleteProduct(product._id)} src={assets.delete_icon} alt="" className='cursor-pointer' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default ManageProducts
