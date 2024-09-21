import {Router} from "express";
import {createProduct,adminregister,getProducts,getProductById,deleteProduct,updateProduct,getProductsByCategory, adminlogin} from "../controllers/admin.controller.js";
const router = Router();
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const imageChanges = (req, res, next) => {
    console.log("hello world",req.body);
    const { imgStatus } = req.params;
    if (imgStatus === "true") {
        // Use the multer upload middleware with a callback for error handling
        upload.fields([{ name: 'productImage', maxCount: 1 }])(req, res, (err) => {
            if (err) {
                // Handle the error properly and respond
                return res.status(400).json({ error: 'File upload failed', details: err.message });
            }
            // Proceed to the next middleware if upload is successful
            next();
        });
    } else {
        // If imgStatus is not "true", just proceed to the next middleware
        next();
    }
};


router.route("/register").post(adminregister);
router.route("/create").post(
    upload.fields([  // this is middleware of multer to upload files
        { name: 'productImage', maxCount: 1 }
    ]),
    createProduct);
router.route("/getproduct").get( getProducts);
router.route("/getbyid/:id").get( getProductById);
router.route("/delete/:id").delete( deleteProduct);
router.route("/update/:id/:imgStatus").put(imageChanges,updateProduct);
router.route("/getbycategory/:category").get( getProductsByCategory);
router.route("/login").post(adminlogin);
router.route("/verify").get(verifyJWT, (req, res) => {
    if (req.user) {
        return res.json(new ApiResponse(
            200,
            {
                isAuthenticated: true,
                user: req.user,
            },
            "Authentication checked successfully"
        ));
    }
    else {
        return res.json(new ApiResponse(
            200,
            {
                isAuthenticated: true,
                admin:req.admin
            },
            "Authentication for admin successfull"
        ));
    }
});
export default router;