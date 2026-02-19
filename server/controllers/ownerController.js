import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Product from "../models/product.js";
import User from "../models/User.js";
import fs from 'fs';

//API to change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json ({success: true,  message: "Now you can list products"})

    } catch (error) {
        console.log(error.message);
        res.json ({success: false,  message: "error.message"})
    }
}

//API to list Product

export const addProduct = async (req, res)=>{
    try{
      const {_id} = req.user;
      let product = JSON.parse(req.body.productData);
      const imageFile = req.file;
      
      //upload Image to ImageKit
      const fileBuffer = fs.readFileSync(imageFile.path)
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: '/products'
      })

      // optimization through imagekit URL transformation
      var optimizedImageUrl = imagekit.url({
        path : response.filePath,
        transformation: [
          {width: '1280'}, // Width resizing
          {quality: 'auto'}, // Auto compression
          { format : 'webp'} // Convert to modern format
        ]
      });

      const image = optimizedImageUrl;
      await Product.create({...product, owner: _id, image})

      res.json({success: true, message: "Product Added"})


    } catch (error) {
      console.log(error.message);
      res.json({success: false, message: error.message})
    }
}

//API to List Owner Products
export const getOwnerProducts = async (req, res)=>{
  try {
    const {_id} = req.user;
    const products = await Product.find({owner: _id})
    res.json({success: true, products})

  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}

// API to Toggle Product Availability
export const toggleProductAvailability = async (req, res) =>{
   try {
    const {_id} = req.user;
    const {productId} = req.body;
    const product = await Product.findById(productId)

    // Checking is car belongs to the user
    if(product.owner.toString() != _id.toString()){
      return res.json({success: false, message: "Unauthorized"});
    }

    product.isAvailable = !product.isAvailable;
    await product.save()

    res.json({success: true, message: "Availability Toggled"})

  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}

// API to delete a product
export const deleteProduct = async (req, res) =>{
   try {
    const {_id} = req.user;
    const {productId} = req.body;
    const product = await Product.findById(productId)

    // Checking is car belongs to the user
    if(product.owner.toString() != _id.toString()){
      return res.json({success: false, message: "Unauthorized"});
    }

    product.owner = null;
    product.isAvailable = false;
    await product.save()

    res.json({success: true, message: "Product Removed"})

  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}

// API to get Dashboard Data 

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role} = req.user;

    if(role != 'owner') {
      return res.json({ success: false, message: "Unauthorized"});
    }
    const products = await Product.find({owner: _id})
    const bookings = await Booking.find({ owner: _id}).populate('product').sort({ createdAt: -1})

    const pendingBookings = await Booking.find({ owner: _id, status: "pending"})
    const completedBookings = await Booking.find({ owner: _id, status: "confirmed"})

    // Calculate monthlyRevenue from bookings where status is confirmed
    const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

    const dashboardData = {
      totalProducts: products.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0,3),
      monthlyRevenue
    }

    res.json({success: true, dashboardData});

  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
  try {
    const {_id} = req.user;

    const imageFile = req.file;

    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path)
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/users'
    })

    // optimization through imagekit URL transformation
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {width: '1280'},// Width resizing
          {quality: 'auto'}, // Auto compression
          { format : 'webp'} // Convert to modern format
      ]
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id,{image});
    res.json({success: true, message: "Image Updated" })
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}