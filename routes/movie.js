var express = require('express');
var router = express.Router();
var movieModels = require("../models/movie-models");
const JWT = require('jsonwebtoken');
const config = require("../util/config");

// 1.
router.get("/all", async function(req, res, next){
    const authHeader = req.header("Authorization"); // define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  // main activity goes here
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

// 2.
router.get("/findName", async function (req, res) {
    console.log("FindName route hit");
    const authHeader = req.header("Authorization"); // define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  // main activity goes here
                    try {
                        const {name} = req.query;
                        if (!name) {
                            return res.status(400).json({ status: false, message: "Movie title is required" });
                        }
                        var list = await movieModels.find({title: {$eq: name}});
                        res.json(list);
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

// 3.
router.get("/findLessOrGreater", async function (req, res) {
    const authHeader = req.header("Authorization"); // define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  // main activity goes here
                    try {
                        const {leastVal, greatestVal} = req.query;
                        var list = await movieModels.find({$or: [{totalComment: {$lte: leastVal}}, {views: {$gte: greatestVal}}]});
                        res.json(list);
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

// 4. 
router.get("/findBetween", async function (req, res) {
    const authHeader = req.header("Authorization"); // define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  // main activity goes here
                    try {
                        const {minVal, maxVal} = req.query;
                        var list = await movieModels.find({price: {$gte: minVal, $lte: maxVal}});
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

// 5.
router.delete("/delete/movieID/:movieID", async function (req, res) {
    const authHeader = req.header("Authorization"); // define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  // main activity goes here
                    try {
                        const {movieID} = req.params; // Get the movieID from the URL
                        const movie = await movieModels.findOneAndDelete({movieID});
                        if (movie) {
                            res.status(200).json({ status: true, message: "Movie deleted" });
                        } else {
                            res.status(404).json({ status: false, message: "Movie not found" });
                        }
                    } catch (error) {
                        res.status(400).json({status: false, message: "an error has occured - " + error});
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

// 6. 
router.put("/edit/:id", async function (req, res) {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    try {
                        // Get movieID from URL parameter instead of the request body
                        const {id} = req.params; // Extract the ID from the URL params
                        const {title, views, totalRating, description, publisher, price, genre, totalComment} = req.body;
                        
                        // Find the movie using the correct movieID
                        const findMovie = await movieModels.findOne({ movieID: id });
                        
                        if (findMovie) {
                            findMovie.title = title ? title : findMovie.title;
                            findMovie.views = views ? views : findMovie.views;
                            findMovie.totalRating = totalRating ? totalRating : findMovie.totalRating;
                            findMovie.description = description ? description : findMovie.description;
                            findMovie.publisher = publisher ? publisher : findMovie.publisher;
                            findMovie.price = price ? price : findMovie.price;
                            findMovie.genre = genre ? genre : findMovie.genre;
                            findMovie.totalComment = totalComment ? totalComment : findMovie.totalComment;
                            await findMovie.save();
                            res.status(200).json({ status: true, message: "movie updated" });
                        } else {
                            res.status(400).json({ status: false, message: "no such movie exists" });
                        }
                    } catch (error) {
                        res.status(400).json({ status: false, message: "an error has occurred - " + error });
                    }
                }
            });
        } else {
            res.status(401).json({ status: 401, message: "Token is missing" });
        }
    } else {
        res.status(401).json({ status: 401, message: "Authorization header missing or malformed" });
    }
});



// 7.
router.post("/add", async function (req, res) {
    const authHeader = req.header("Authorization"); //define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  //main activity goes here
                    try {
                        const {movieID, title, totalRating, description, userID, publisher, price, genre} = req.body;
                        // Set default values
                        const views = 0;  // Default value for views
                        const totalComments = 0;  // Default value for totalComments
                        const releaseDate = new Date().toISOString().split('T')[0]; // Format current date as yyyy-mm-dd
                        const newItem = {movieID, title, views, totalComments, totalRating, description, releaseDate, userID, publisher, price, genre};
                        await movieModels.create(newItem);
                        res.status(200).json({status: true, message: "new movie was created"});
                    } catch (error) {
                        res.status(400).json({status: false, message: "an error has occured - " + error});
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

// 8.
router.get("/findTitle-publisher-genre", async function (req, res) {
    const authHeader = req.header("Authorization"); //define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  //main activity goes here
                    try {
                        const {findTitle, findPublisher, findGenre} = req.query;
                        var list = await movieModels.find({$and: [{title: {$eq: findTitle}}, {publisher: {$eq: findPublisher}}, {genre: {$eq: findGenre}}]});
                        res.status(200).json(list);
                    } catch (error) {
                        res.status(400).json({status: false, message: "an error has occured"});
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

// 9.
router.get("/sortByPrice", async function (req, res) {
    const authHeader = req.header("Authorization"); //define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  //main activity goes here
                    try {
                        var list = await movieModels.find().sort({price: 1});
                        res.status(200).json(list);
                    } catch (error) {
                        res.status(400).json({status: false, message: "an error has occured"});
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

// 10.
router.get("/topOfGenre", async function (req, res) {
    const authHeader = req.header("Authorization"); //define authHeader
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = req.header("Authorization").split (' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({"status": 403, "err": err});
                }else{  //main activity goes here
                    try {
                        const {topGenre} = req.query;
                        var list = await movieModels.find({genre: {$eq: topGenre}}).sort({totalRating: -1}).limit(1);
                        var topList = await movieModels.find({genre: {$eq: topGenre}, totalRating: {$eq: list[0].totalRating}});
                        res.status(200).json(topList);
                    } catch (error) {
                        res.status(400).json({status: false, message: "an error has occured" + error});
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