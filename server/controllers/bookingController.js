import Booking from "../models/Booking.js";
import Product from "../models/product.js";

// Funtion to Check Availability of Product for a given Date
const checkAvailability = async (product, rentalStartDate, rentalEndDate)=>{
    const bookings = await Booking.find({
        product,
        rentalStartDate : {$lte: rentalEndDate},
        rentalEndDate : {$gte: rentalStartDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Products for the given Date and location
export const checkAvailabilityOfProduct = async (req, res) => {
    try {
        const {location, rentalStartDate, rentalEndDate} = req.body

        // fetch all available products for the given location
        const products = await Product.find({location, isAvailable: true})

        // check product availability for the given date range using promise
        const availableProductsPromises = products.map(async (product)=>{
            const isAvailable = await checkAvailability(product._id, rentalStartDate, rentalEndDate)
            return {...product._doc, isAvailable: isAvailable}
        })

        let availableProducts = await Promise.all(availableProductsPromises);
        availableProducts = availableProducts.filter(product => product.isAvailable === true)

        res.json({success: true, availableProducts})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
 export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const {product, rentalStartDate, rentalEndDate} = req.body;
        const productData = await Product.findById(product);
        if (!productData) {
          return res.json({ success: false, message: "Product not found" });
        }

        // Prevent owner from booking/renting their own product
        if (productData.owner.toString() === _id.toString()) {
          return res.json({
          success: false,
          message: "You cannot rent your own product.",
        });
    }
        // Check availability
        const isAvailable = await checkAvailability(product, rentalStartDate, rentalEndDate);
        if (!isAvailable) {
         return res.json({ success: false, message: "Product is not available" });
        }

        // Calculate price based on rentalStartDate and rentalEndDate
        const picked = new Date(rentalStartDate);
        const returned = new Date(rentalEndDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const price = productData.pricePerDay * noOfDays

        await Booking.create({product, owner: productData.owner, user: _id, rentalStartDate, rentalEndDate, price})

        res.json({success: true, message: "Booking Created"})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
 }

 // API to List User Bookings
 export const getUserBookings = async (req, res)=>{
    try {
    const{_id} = req.user;
    const bookings = await Booking.find({ user: _id}).populate("product").sort({createdAt: -1})
    res.json({success: true, bookings})

} catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
}
 }

  // API to get Owner Bookings
 export const getOwnerBookings = async (req, res)=>{
    try {
    if(req.user.role !== 'owner') {
        return res.json({success: false, message: "Unauthorized"})
    }
    const bookings = await Booking.find({owner: req.user._id}).populate('product user').select("-user.password").sort({createdAt: -1})
    res.json({success: true, bookings})
    
} catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
}
 }

 // API to change booking status
 export const changeBookingStatus = async (req, res)=>{
    try {
    const {_id} = req.user;
    const {bookingId, status} = req.body;

    const booking = await Booking.findById(bookingId)

    if(booking.owner.toString() !== _id.toString()) {
        return res.json({success: false, message: "Unauthorized"})
    }
    booking.status = status;
    await booking.save();
    
    res.json({success: true, message: "Status Updatd"})
    
} catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
}
 }

