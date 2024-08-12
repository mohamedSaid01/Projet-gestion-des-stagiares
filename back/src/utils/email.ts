import crypto from 'crypto';
import  { SendMailOptions, Transporter } from "nodemailer";

const nodemailer  = require('nodemailer')

export const generateRandomCode = (length = 6) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
};


export const sendResetCodeByEmail = async (email: string, code: string): Promise<void> => {
    // Configuration de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.HOST, 
      port: process.env.MAIL_PORT, 
        auth: {
            user:process.env.USER, // Adresse email à partir de laquelle envoyer
            pass: process.env.PASS // Mot de passe de l'adresse email
        }
    });
    // Définition du contenu de l'email
    const mailOptions: SendMailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Reset code',
        text: `Your reset code is : ${code}`
    };
    try {
        // Envoi de l'email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Une erreur s'est produite lors de l'envoi de l'email à ${email}:`, error);
        throw error;
    }
};
