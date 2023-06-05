const express = require("express");
const router = express.Router();
const getuser = require("../middleware/getuser");
const upload = require("../middleware/fileUpload");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct , getProductsByUser, getProductsWithToken, getProductsforAdmin, updateproductimageurl } = require("../controllers/productController");


router.route("/").get(getProducts);
router.route("/adminproducts").get(getProductsforAdmin);
router.route("/tier-products").get(getuser, getProductsWithToken);
router.route("/user").get(getuser, getProductsByUser);
router.route("/:id").get(getProductById);
router.route("/create").post(getuser, upload.array("photos"), createProduct);
router.route("/update/:id").put(upload.array("photos"), updateProduct);
router.route("/delete/:id").delete(deleteProduct);
router.route("/updateproductimageurl").put(updateproductimageurl);

module.exports = router;
