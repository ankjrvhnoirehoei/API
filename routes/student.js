var express = require('express');
var router = express.Router();
var studentModels = require("../models/student-models");

//1.
router.get("/all", async function(req, res, next){
    try {
        var list = await studentModels.find();
        res.status(200).json(list);
    } catch (error) {
        res.json({status: false, message: "an error has occured"});
    }
});

//2.
router.get("/findMajor", async function (req, res) {
    try {
        const {findMajor} = req.query;
        var list = await studentModels.find({major: {$eq: findMajor}});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured"});
    }
});

//3.
router.get("/avgScore", async function (req, res) {
    try {
        const {avgMin, avgMax} = req.query;
        var list = await studentModels.find({avgScore: {$gte: avgMin, $lte: avgMax}});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured"});
    }
});

//4.
router.get("/studentID", async function (req, res) {
    try {
        const {findID} = req.query;
        var list = await studentModels.find({studID: {$eq: findID}});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured"});
    }
})

//5.
router.post("/add", async function (req, res) {
    try {
        const {studID, studName, avgScore, major, age} = req.body;
        const newStud = {studID, studName, avgScore, major, age};
        await studentModels.create(newStud);
        res.status(200).json({status: true, message: "new student added"});
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured" + error});
    }
});

//6.
router.put("/edit", async function (req, res) { 
    try {
        const {id, studID, studName, avgScore, major, age} = req.body;
        const findStud = await studentModels.findById(id);
        if (findStud) {
            findStud.studID = studID ? studID : findStud.studID;
            findStud.studName = studName ? studName : findStud.studName;
            findStud.avgScore = avgScore ? avgScore : findStud.avgScore;
            findStud.major = major ? major : findStud.major;
            findStud.age = age ? age : findStud.age;
            await findStud.save();
            res.status(200).json({status: true, message: "student info updated"});
        } else {
            res.status(400).json({status: false, message: "no such student exists"});
        }
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured - " + error});
    }
});

//7.
router.delete("/delete/:id", async function (req, res) {
    try {
        const {id} = req.params;
        await studentModels.findByIdAndDelete(id);
        res.status(200).json({status: true, message: "student removed"});
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured - " + error});
    }
});

//8.
router.get("/findMajorAndAvg", async function (req, res) {
    try {
        const {findMajor, findAvg} = req.query;
        var list = await studentModels.find({$and: [{major: {$eq: findMajor}}, {avgScore: {$gte: findAvg}}]});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured"});
    }
});

//9.
router.get("/findMajor-Avg-Age", async function (req, res) {
    try {
        const {findMajor, findAvg, findAgeMin, findAgeMax} = req.query;
        var list = await studentModels.find({$and: [{major: {$eq: findMajor}}, {avgScore: {$gte: findAvg}}, {age: {$gte: findAgeMin, $lte: findAgeMax}}]});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured"});
    }
});

//10.
router.get("/sortByAvg", async function (req, res) {
    try {
        var list = await studentModels.find().sort({avgScore: 1});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured"});
    }
});

//11.
router.get("/highestTechScore", async function (req, res) {
    try {
        const {majorTop} = req.query;
        var list = await studentModels.find({major: {$eq: majorTop}}).sort({avgScore: -1}).limit(1);
        var topList = await studentModels.find({major: {$eq: majorTop}, avgScore: {$eq: list[0].avgScore}});
        res.status(200).json(topList);
    } catch (error) {
        res.status(400).json({status: false, message: "an error has occured" + error});
    }
});

module.exports = router;