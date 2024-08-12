import { Router } from "express";
import { createNewPassword, loginUser, registerUser, requestPasswordReset, validateResetCode } from "../controllers/authController";
import upload from "../utils/multerConfig";
import Joi from "joi";
import { validateSchema } from "../middlewares/validator";

const router = Router();

const registerSchema = Joi.object({
    username : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
    role : Joi.string().valid('user', 'admin'),
    birthday : Joi.date().required(),
    typeOfStage : Joi.string().required(),
    studyLocation : Joi.string().required(),
    phoneNumber : Joi.string().length(8).pattern(/^[259]/).required(),
    gender : Joi.string().valid('male', 'femal').required(),
    adress : Joi.string().required(),
    numCIN : Joi.string().length(8).required(),
    duration : Joi.string().required(),
})

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required(),
})

const requestPasswordResetSchema = Joi.object({
    email : Joi.string().email().required(),
})

const codeSchema = Joi.object({
    code : Joi.string().length(6).required(),
})

const newPasswordSchema = Joi.object({
    password : Joi.string().min(6).required(),
    confirmPassword : Joi.string().min(6).required(),
})

router.post("/register", upload.single('profilePictureUrl'), validateSchema(registerSchema,'body'), registerUser);
router.post("/login", validateSchema(loginSchema,'body'), loginUser);
router.post("/sendResetCodeByEmail", validateSchema(requestPasswordResetSchema,'body'), requestPasswordReset);
router.post("/validateResetCode", validateSchema(codeSchema,'body'), validateResetCode);
router.post("/newpassword", validateSchema(newPasswordSchema,'body'), createNewPassword);

export default router;