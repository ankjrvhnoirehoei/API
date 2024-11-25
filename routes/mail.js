const nodemailer = require("nodemailer");
var express = require('express');
var router = express.Router();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'nguyenquocanh289@gmail.com',
        pass: 'lyow gnlo mgii gfyh'
    }
});

router.post("/send-mail", async function(req, res, next){
    try{
        const {to, subject, content} = req.body;

        const mailOptions = {
            from: "ark <nguyenquocanh289@gmail.com>",
            to: to,
            subject: subject,
            html: content
        };
        await transporter.sendMail(mailOptions);
        res.json({ status: 1, message: "Mail sent successfully"});
    }catch(err){
        res.json({ status: 0, message: "Failed to send mail " + err});
    }
});
  

module.exports = router;
// module.exports = { transporter };
