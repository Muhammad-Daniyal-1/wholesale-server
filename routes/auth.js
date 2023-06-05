const express = require("express");
const router = express.Router();
const getuser = require("../middleware/getuser");

const { registerUser, loginUser, editUser, deleteUser, getUser, getAllUsers, approveUser } = require("../controllers/authController");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getAll").get(getuser, getAllUsers);
router.route("/edit/:id").put(getuser, editUser);
router.route("/delete/:id").delete(getuser, deleteUser);
router.route("/getuser/:id").get(getuser, getUser);
router.route("/approve/:id").put(getuser, approveUser);


module.exports = router;
