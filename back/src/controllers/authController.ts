import { Request, Response } from "express";
import User, { IUser } from "../database/models/User";
import bcrypt from 'bcryptjs'
import _ from 'lodash'
import jwt, { Secret } from 'jsonwebtoken'
import { generateRandomCode, sendResetCodeByEmail } from "../utils/email";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { file, username, email, password, role, birthday, typeOfStage, studyLocation, phoneNumber, gender, adress, numCIN, duration  } = req.body;
  
        // Vérifier si l'e-mail existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists! Please try another one.' });
            return;
        }

        const existingCIN = await User.findOne({ numCIN });
        if (existingCIN) {
            res.status(400).json({ error: 'CIN already exists! Please try another one.' });
            return;
        }

     // Vérifier si une image est téléchargée
      if (req?.file) {
        const file: Express.Multer.File = req?.file;
        const allowedImagesTypes = ['image/jpg', 'image/png', 'image/jpeg'];
        if (!allowedImagesTypes.includes(file?.mimetype)) {
            return res.status(400).json({ error: 'Only png and jpg types are allowed !' });
        }
    }
  
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
  
  
        const newUser: IUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePictureUrl: req?.file?.filename,
            role,
            birthday, 
            typeOfStage, 
            studyLocation, 
            phoneNumber, 
            gender, 
            adress, 
            numCIN,
            duration
        });
  
        // Enregistrer le nouvel utilisateur dans la base de données
        await newUser.save();
  
        // Répondre avec succès
        res.status(200).json({
            message: 'User registered successfully',
            data: _.pick(newUser, ['_id', 'username', 'email', 'profilePictureUrl', 'role', 'birthday', 'typeOfStage', 'studyLocation', 'phoneNumber', 'gender', 'adress', 'assignmentLetter', 'numCIN', 'duration']),
        });
  
    } catch (err: any) {
        console.error('Error:', err);
        res.status(400).json({ error: `❌ Error occurred while registering user: ${err.message} ❌`, message: err.message });
    }
  };


  export const loginUser = async (req:Request,res:Response)=>{
    try{
            const {email,password} = req.body

            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({error:'Invalid email or password'})
            }
            
            if (!user.password) {
              return res.status(400).json({ error: 'Password not set' });
          }

            const isMatch=await bcrypt.compare(password, user.password)
            if (!isMatch){
                return res.status(400).json({error:'Invalid email or password'})
            }

            const secretKey: Secret = process.env.JWT_SECRET_KEY || '';
            const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '30d' });

            res.status(200).json({message:'Logged in successfully', token, user})
    }
    catch(err){
        console.log('error',err)
        res.status(400).json({error:'❌ ERROR HAPPEN AT LOGIN USER !!! ❌'})
    }
}


export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      // Check if email exists in the database
      const user: IUser | null = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Generate and Send Code
      const resetCode = generateRandomCode();
       resetCodeTemp = resetCode;
       emailTemp = email;      
      // Envoyer le code de réinitialisation par e-mail
      sendResetCodeByEmail(email, resetCode);
      res.status(200).json({ message: "Reset code sent successfully", code: resetCode });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  let resetCodeTemp: string | null 
  let emailTemp: string | null 


  export const validateResetCode = (req: Request, res: Response) => {
    const { code } = req.body;
    try {
      if (resetCodeTemp === null || resetCodeTemp !== code) { // Comparer le code de réinitialisation avec celui stocké dans la variable globale temporaire
        return res.status(400).json({ error: "Invalid reset code" });
      }
      res.status(200).json({
        message: "Code validated successfully. Proceed to reset password.",
        code: code // Retourner le code de réinitialisation dans la réponse JSON
      });
    } catch (error) {
      console.error("Error validating reset code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  
export const createNewPassword = async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;

    try {
        // Vérifier si password et confirmPassword sont présents
        if (!password || !confirmPassword) {
            return res.status(400).json({ error: "Missing password or confirm password" });
        }

        // Vérifier si password et confirmPassword sont identiques
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Vérifier si le code de réinitialisation est valide (dans ce cas, stocké ailleurs)
        if (!resetCodeTemp || !emailTemp) {
            return res.status(400).json({ error: "Missing reset code or email" });
        }
               
        // Rechercher l'utilisateur par son e-mail dans la base de données
        const user: IUser | null = await User.findOne({ email: emailTemp });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hacher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Mettre à jour le mot de passe de l'utilisateur et supprimer le code de réinitialisation
        user.password = hashedPassword;
        await user.save();

        // Réinitialiser les variables temporaires
        resetCodeTemp = null;
        emailTemp = null;

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error creating new password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
  
