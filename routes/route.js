const express = require("express");
const router = new express.Router();
const Register = require("../app/models/register");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");



router.get("/", (req, res) => {
  res.render("home");
});



router.get("/login", (req, res) => {
  res.render("auth/login");
});



router.get("/register", (req, res) => {
  res.render("auth/register");
});



router.get("/userDetails", async (req, res) => {
  try {
    const getUsers = await Register.find();
    console.log(getUsers);
    return res.render("users/userDetails", { users: getUsers });
  } catch (err) {
    res.status(400).send(err);
  }
});



router.get("/contact", (req, res) => {
  res.render("auth/contact");
});





router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
      const RegisterVal = new Register({
        username: username,
        email: email,
        phone: phone,
        password: password,
        confirmPassword: confirmPassword,
      });

      const token_val = await RegisterVal.generateAuthToken();

      res.cookie("jwt", token_val, {
        expires: new Date(Date.now() + 3000),
        httpOnly: true,
      });

      const registerResult = await RegisterVal.save();
      return res.redirect("/");
    } else {
      res.send("password not match");
    }
  } catch (err) {
    return res.redirect("/register");
  }
});




router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await Register.findOne({ email: email });
    console.log(userData.password);

    const password_compare = await bcrypt.compare(password, userData.password);

    const token = await userData.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3000),
      httpOnly: true,
    });

    if (password_compare) {
      res.status(201).render("home");
    } else {
      res.send("invalid login detail");
    }
  } catch (err) {
    res.status(400).send("invalid login detail");
  }
});





router.get("/delete/:id", (req, res) => {
  Register.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("users/userDetails");
    } else {
      console.log("Error in users delete :" + err);
    }
  });
});






module.exports = router;
