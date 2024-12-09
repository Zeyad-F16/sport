const nodemailer = require('nodemailer')

const sendEmail = async(options)=>{

const transporter = nodemailer.createTransport({
host : process.env.EMAIL_HOST,
port :process.env.EMAIL_PORT, 
secure: true,
auth:{
    user:process.env.EMAIL_ADMIN,
    pass:process.env.EMAIL_PASSWORD,
},
});

 const mailOptions ={
    from: "Assuit Motorsport <zeyadmotorsport@gmail.com>",
    to : options.email,
    subject : options.subject,
    text : options.message,
 };

 await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;