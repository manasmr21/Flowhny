const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config({path: "../.env"})

const senderMail = process.env.mail
const senderPassword = process.env.password

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user : senderMail,
        pass : senderPassword
    }
})

const sendMail = (mail)=>{
    transporter.sendMail(mail, (error, info)=>{
        if(error){
            console.log(error.message)
            // return res.status(400).json({message :`Message not sent.`, error : error.message  })
        }else{
            console.log(info)
            // res.status(200).json({success: true, message : "Message sent Successfully", info})
        }
    })
}

exports.sendVerificationCode = (email, code)=>{
    const mail = {
        from : senderMail,
        to : email,
        subject: "User verification Code",
        html: `
            <p>Find the verification code bellow</p> <br/>
            <h1> ${code} </h1>
                    `
    }

    sendMail(mail);
}