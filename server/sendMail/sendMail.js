const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const senderMail = process.env.mail;
const senderPassword = process.env.password;

const transporter = nodemailer.createTransport({
  port:465,
  host:"smtp.gmail.com",
  auth: {
    user: senderMail,
    pass: senderPassword,
  },
});

const sendMail = async(mail) => {
 try {
  await new Promise((resolve, reject)=>{
  transporter.sendMail(mail, (error, info)=>{
    if(error){
      console.log(error);
      reject(error);
        
    }else{
      resolve(info);
      res.status(200).json({success: true, message: "Email sent", info})
    }
  })
 })
 } catch (error) {
  return { success: false, message: error.message };
 }
};

exports.sendVerificationCode = (email, code) => {
  const mail = {
    from: senderMail,
    to: email,
    subject: "User verification Code",
    html: `
            <p>Find the verification code bellow</p> <br/>
            <h1> ${code} </h1>
                    `,
  };

  sendMail(mail);
};

exports.sendAdminRouteMail = (email, route) => {
  const mail = {
    from: senderMail,
    to: email,
    subject: "Route for admin panel",
    html: `
      <p>Click on the link below to navigate to the admin login page:</p> <br/>
      <a href="http://localhost:5173/admin/${route}" target="_blank">
        Click here
      </a>
    `,
  };

  sendMail(mail);
};

