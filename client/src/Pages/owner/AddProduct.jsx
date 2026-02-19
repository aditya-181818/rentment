import React,{useState} from 'react'
import Title from '../../components/owner/Title'
import { assets} from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddProduct = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [product, setProduct] = useState({
    name: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    location: '',
    description: '',
  }) 

  const[isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e)=> {
    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('productData', JSON.stringify(product))

      const {data} = await axios.post('/api/owner/add-product', formData)

      if(data.success) {
        toast.success(data.message)
        setImage(null)
        setProduct({
          ProductName: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          location: '',
          description: '',
        })
      }else {
        toast.error(data.message)
      }
    }catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
   <div className='px-4 py-10 md:px-10 flex-1'>
    <Title title="Add New Product" subTitle="Fill in details to list a new prodcut for booking, including pricing, availability, and product specifications."/>
    <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
    {/* Product Image */}
    <div className='flex items-center gap-2 w-full'>
     <label htmlFor="product-image">
      <img src={image ?  URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer'/>
      <input type="file" id="product-image" accept="image/*" hidden onChange={e=>setImage(e.target.files[0])}/>
     </label>
     <p className='text-sm text-gray-500'>Upload a picture of your product</p>
   </div>

   {/* Product Name */}
   <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
    <div className='flex flex-col w-full'>
      <label>Product Name</label>
      <input type="text" placeholder='e.g. Camera, Projector...' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={product.name} onChange={e=> setProduct({...product, name: e.target.value})} />
    </div>
   </div>

   {/* Product Year, price, Category */}
   <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
    <div className='flex flex-col w-full'>
      <label>Year</label>
      <input type="number" placeholder="0" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={product.year} onChange={e=> setProduct({...product, year: e.target.value})} />
    </div>
    <div className='flex flex-col w-full'>
      <label>Daily Price ({currency})</label>
      <input type="number" placeholder="0" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={product.pricePerDay} onChange={e=> setProduct({...product, pricePerDay: e.target.value})} />
    </div>
    <div className='flex flex-col w-full'>
      <label>Category</label>
      <select onChange={e=> setProduct({...product, category: e.target.value})} value={product.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
        <option value="">Select a category</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Car">Car</option>
        <option value="Bike">Bike</option>
        <option value="Cycle">Cycle</option>
        <option value="Tools">Musical Instruments</option>
        <option value="Tools">Tools</option>
        <option value="etc.">etc.</option>
      </select>
    </div>
   </div>
   {/* Location */}
   <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
    <div className='flex flex-col w-full'>
      <label>Location</label>
      <input type="text" placeholder='e.g. Lucknow, UP' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={product.location} onChange={e=> setProduct({...product, location: e.target.value})} />
    </div>
   </div>
   {/* Product Description */}
   <div className='flex flex-col w-full'>
      <label>Description</label>
      <textarea rows={5} placeholder="Describe your product, its condition, and any notable details..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={product.description} onChange={e=> setProduct({...product, description: e.target.value})} ></textarea>
    </div>
    <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
      <img src={assets.tick_icon} alt="" />
      {isLoading ? 'Listing...': 'List Your Product'}
    </button>
   </form>
  </div>
  )
}

export default AddProduct
