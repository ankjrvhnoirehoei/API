var express = require('express');
var router = express.Router();
var movieModels = require("../models/movie-models");
const JWT = require('jsonwebtoken');
const config = require("../util/config");

router.get("/all", async function(req, res, next){
    const authHeader = req.header("Authorization"); //define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  //main activity goes here
                    try {
                        var list = await movieModels.find();
                        res.status(200).json(list);
                    } catch (error) {
                        res.json({status: false, message: "an error has occured"});
                    }
                }
            });
        } else{
            res.status(401).json({status: 401, message: "Token is missing"});
        }
    } else {
        res.status(401).json({status: 401, message: "Authorization header missing or malformed"});
    }
});

module.exports = router;