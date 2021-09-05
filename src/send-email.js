const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');

dotEnv.config('.env');

const user = process.env.USER_EMAIL
const pass = process.env.PASS_EMAIL

const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: Number(process.env.PORT_EMAIL),
    secure: false,
    auth: { user, pass }
})

async function sendEmail(dataSend) {
    if (dataSend) {
        try {
            const mailSent = await transporter.sendMail({
                from: user,
                to: dataSend.email,
                subject: dataSend.subject,
                html: dataSend.content    
            })
            return mailSent
        } catch (error) {
            return error
        }       
    }
}

module.exports = {
    sendEmail
}