var express = require('express');
var router = express.Router();
var userModels = require("../models/user-models");
const JWT = require('jsonwebtoken');
const config = require("../util/config");

router.post("/login", async function (req, res) {
  try {
    const {username, password} = req.body;
    const chkUser = await userModels.findOne({userName: username, password: password});
    if (chkUser == null) {
      res.status(404).json({status: false, message: "login failed"});
    } else {
      const token = JWT.sign({id: userModels._id}, config.SECRETKEY,{expiresIn: '3000s'});
      const refreshToken = JWT.sign({id: userModels._id}, config.SECRETKEY,{expiresIn: '1h'});
      res.status(200).json({status: true, message: "login successfully", token: token, refreshToken: refreshToken});
    }
  } catch (error) {
    res.status(404).json({status: false, message: "an error has occured " + error});
    console.log(config.SECRETKEY);
  }
})

router.get("/findList", async function(req, res) {
  const {listClient} = req.query;
  var list = await userModels.find({age: {$eq: listClient}});
  res.json(list);
});

module.exports = router;
