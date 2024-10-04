import { Router } from "express";
import {
  createProduct,
  adminregister,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductsByCategory,
  adminlogin,
  getOrder,
  getOrderDetails,
  updateorderstatus
} from "../controllers/admin.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import express from "express";

const router = Router();
const imageChanges = (req, res, next) => {
    
    const { imgStatus } = req.params;
    if (imgStatus === "true") {
      upload.fields([{ name: 'productImage', maxCount: 1 }])(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: 'File upload failed', details: err.message });
        }
        next();
      });
    } else {
      // If no file upload, use express.json() and express.urlencoded()
      express.json()(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: 'Failed to parse JSON', details: err.message });
        }
        express.urlencoded({ extended: true })(req, res, (err) => {
          if (err) {
            return res.status(400).json({ error: 'Failed to parse urlencoded data', details: err.message });
          }
          next();
        });
      });
    }
  };
// Parse JSON for all routes
router.use(express.json());

router.route("/register").post(adminregister);
router.route("/create").post(
  upload.fields([{ name: 'productImage', maxCount: 1 }]),
  createProduct
);
router.route("/getproduct").get(getProducts);
router.route("/getbyid/:id").get(getProductById);
router.route("/delete/:id").delete(deleteProduct);
router.route("/update/:id/:imgStatus").put(imageChanges, updateProduct);
router.route("/getbycategory/:category").get(getProductsByCategory);
router.route("/login").post(adminlogin);
router.route("/getorders/:date").get(verifyJWT,getOrder)
router.route("/order/:id").get(verifyJWT,getOrderDetails);
router.route("/updateOrderStatus").post(verifyJWT,updateorderstatus);
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
  } else if(req.admin) {
    return res.json(new ApiResponse(
      200,
      {
        isAuthenticated: true,
        admin: req.admin
      },
      "Authentication for admin successful"
    ));
  }else{
    return res.json(new ApiResponse(
      200,
      {
        isAuthenticated: false,
      },
      "Authentication failed"
    ));
  }
});

export default router;