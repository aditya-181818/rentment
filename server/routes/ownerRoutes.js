import express from "express";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";
import { addProduct, changeRoleToOwner, deleteProduct, getDashboardData, getOwnerProducts, toggleProductAvailability, updateUserImage } from "../controllers/ownerController.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-product", upload.single("image"), protect, addProduct)
ownerRouter.get("/products", protect, getOwnerProducts)
ownerRouter.post("/toggle-product", protect, toggleProductAvailability)
ownerRouter.post("/delete-product", protect, deleteProduct)

ownerRouter.get('/dashboard', protect, getDashboardData)
ownerRouter.post('/update-image',upload.single("image"), protect, updateUserImage )

export default ownerRouter;