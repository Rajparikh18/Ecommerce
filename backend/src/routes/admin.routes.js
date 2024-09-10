import {Router} from "express";
import {createProduct,getProducts,getProductById,deleteProduct,updateProduct,getProductsByCategory} from "../controllers/admin.controller.js";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";

router.route("/create").post( 
    upload.fields([  // this is middleware of multer to upload files
        { name: 'productImage', maxCount: 1 }
    ]),
    createProduct);
router.route("/getproduct").get( getProducts);
router.route("/getbyid/:id").get( getProductById);
router.route("/delete").delete( deleteProduct);
router.route("/update").put( updateProduct);
router.route("/getbycategory/:category").get( getProductsByCategory);
export default router;