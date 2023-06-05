const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");

const { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById } = require("../controllers/categoryController");

router.route("/").get(getAllCategories).post( upload.single('photo'), createCategory);
router.route("/:id").get(getCategoryById).put( upload.single('photo'), updateCategory).delete(deleteCategory);

module.exports = router;