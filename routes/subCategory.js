const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");

const { addSubCategory, deleteSubCategory, updateSubCategory, getSubCategory } = require("../controllers/subCategoryController");

router.route("/").get(getSubCategory).post( upload.single('photo'), addSubCategory);
router.route("/:id").put( upload.single('photo'), updateSubCategory).delete(deleteSubCategory );

module.exports = router;