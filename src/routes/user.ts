import express from "express"
import jwt from 'jsonwebtoken'
import User from "../models/user.model";
import bcrypt from "bcrypt"
import { isAuthorised } from "../middlewares/isAuthorised.middleware";
import { Request, Response } from "express";
import { response_200, response_400, response_500 } from "../utils/responseCodes.utils";
const router = express.Router();
const jwtKey = process.env.JWT_KEY;


//------------- Find User Route-------------------
router.route("/find/:username").get(isAuthorised, async (req :Request, res: Response) => {
    try{
        const result = await User.findOne({username: req.params.username})
        if(!result){
            return response_400(res, "User Not Found");
        }
        
        return response_200(res, "User Found");
    }
    catch(error){
        console.log("Error At Find User " + error);
        return response_400(res, "User Not Found");
    }
})


//------------- Existing User Check Route-------------------
router.route('/checkusername/:username').get(async (req: Request, res: Response) => {
    try {
        const {name} = req.params;

        const result = await User.findOne({name: name});

        if(!result){
            return response_200(res, "User Not Found");
        }

        return response_400(res, "User Found");
    }
    catch(error){
        console.log("Error At Check Username " + error);
        return response_400(res, "Authentication Failed");
    }
})


//------------- Register Route-------------------
router.route('/register').post(async (req : Request, res: Response) => {
    try {
        const {name, password, email} = req.body;
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            email: email,
            password: hashPass,
        });

        await newUser.save();
        return response_200(res, "Registered Successfully");
    }
    catch(error){
        console.log("Error At Register " + error);
        response_400(res, "Failed To Register");    
    }
})


//------------- Login Route-------------------
router.route('/login').post(async (req: Request, res: Response) => {
    try {
        const {name, password} = req.body;

        const result = await User.findOne({name: name});

        if(!result){
            return response_400(res, "User Does Not Exists");
        }

        const userPass = await bcrypt.compare(result.password, password);

        if(!userPass){
            return response_400(res, "Wrong Password");
        }

        if(!jwtKey){
            return response_500(res, "Internal Server Error");
        }
        const token = jwt.sign({name: name}, jwtKey, {});

        return response_200(res, "Login Successful", {token})
    }
    catch(error){
        console.log("Error At Login " + error);
        response_400(res, "Login Failed");
    }
})




export default router