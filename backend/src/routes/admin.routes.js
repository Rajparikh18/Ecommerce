import {Router} from "express";
import {createProduct,getProducts,getProductById,deleteProduct,updateProduct,getProductsByCategory} from "../controllers/admin.controller.js";
const router = Router();

router.route("/api/create").post( createProduct);
router.route("/api/admin/getproduct").get( getProducts);
router.route("/api/admin/getbyid").get( getProductById);
router.route("/api/admin/delete").delete( deleteProduct);
router.route("/api/admin/update").put( updateProduct);
router.route("/api/admin/getbycategory").get( getProductsByCategory);

export default router;