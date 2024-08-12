import { Router } from "express";
import { createStagiare, deleteStagiare, getAllStagiares, getMyStagiares, getOneStagiareById, updateOneStagiareById } from "../controllers/stagiareController";
import Joi from "joi";
import { validateSchema } from "../middlewares/validator";
import { verifyToken } from "../helpers/authMiddleware";

const router = Router();

const createStagiareSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'User name is required'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const idSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("Invalid user id")
const getOneStagiareByIdSchema = Joi.object({ id: idSchema})

const updateOneStagiareSchema = Joi.object({
    username : Joi.string(),
    email : Joi.string().email(),
    password : Joi.string()
})

router.post("/createStagiare", verifyToken, validateSchema(createStagiareSchema, 'body'), createStagiare);
router.get("/getAllStagiares", getAllStagiares);
router.get("/getMy", verifyToken, getMyStagiares);
router.get("/getStagiare/:id", validateSchema(getOneStagiareByIdSchema, 'params'), getOneStagiareById);
router.put("/updateStagiare/:id", validateSchema(getOneStagiareByIdSchema, 'params'), validateSchema(updateOneStagiareSchema, 'body'), updateOneStagiareById);
router.delete("/deleteStagiare/:id", validateSchema(getOneStagiareByIdSchema, 'params'), deleteStagiare);

export default router;
