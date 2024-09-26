import express from "express"
import jwt from 'jsonwebtoken'
import User from "../models/user.model";
import nodemailer, {SentMessageInfo} from 'nodemailer'
import { Request, Response } from "express";
import { response_200, response_400, response_500 } from "../utils/responseCodes.utils";
const router = express.Router();
const jwtKey = process.env.JWT_KEY;
interface EmailEntry {
    email: string;
    otp: Number;
}
const dictionary: EmailEntry[] = [];
interface user {
    name: String;
    email: String;
    password: String;
}

// Function to Send Email For OTP Veriffication ----------------
function sendEmail(res: Response, email: string){
    const OTP = Math.floor(Math.random()*9000) + 1000 // Generate a 4-digit OTP
    dictionary.push({
        email: email,
        otp: OTP,
    })
    const text = `The OTP for email verification is ${OTP}`;
    const subjectOfEmail = "Email Verification";
    const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth:{
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASS,
        },
    })
    const reciever = {
        from: process.env.SENDER_EMAIL,
        to: [email],
        subject: subjectOfEmail,
        text: text,
    }
    auth.sendMail(reciever, (error : Error | null, emailResponse : SentMessageInfo) => {
        if(error){
            throw error;
        }
        res.end();
    })
}

// Function TO Generate JWT Token -------
async function generateToken(res: Response, user: user){
    try {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                password: user.password,
            },
            process.env.JWT_KEY || '',
            {
                expiresIn: "7d",
            }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true
        });
        return token
    }
    catch(error){
        console.log(error);
        return "";    
    }
}


//------------- Find User Route-------------------
router.route("/find/:email").get(async (req :Request, res: Response) => {
    try{
        const result = await User.findOne({email: req.params.email})
        if(!result){
            console.log("User Not Found At FindName");
            return response_200(res, "User Not Found");
        }
        
        console.log("User Found At FindName");
        return response_400(res, "User Found");
    }
    catch(error){
        console.log("Error At Find User " + error);
        return response_400(res, "User Not Found");
    }
})


//------------- Existing User Check Route-------------------
router.route('/checkusername/:email').get(async (req: Request, res: Response) => {
    try {
        const {email} = req.params;
        const result = await User.findOne({email: email});

        if(!result){
            console.log("User Not Found At CheckUsername")
            return response_400(res, "User Not Found");
        }
        console.log("User Found At CheckUsername")
        return response_200(res, "User Found");
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
        // const hashPass = await bcrypt.hash(password, 10);
        const newUser = {
            name: name,
            email: email,
            password: password,
        };

        // await newUser.save();
        const token = await generateToken(res, newUser);
        sendEmail(res, email);
        console.log("Email Sent");
        return response_200(res, "Email Sent For Verification", {
            name: name,
            email: email,
            password: password,
            token: token,
        });
    }
    catch(error){
        console.log("Error At Register " + error);
        response_400(res, "Failed To Register");    
    }
})


//------------- Login Route-------------------
router.route('/login').post(async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const result = await User.findOne({email: email});
        console.log(req.body);

        if(!result){
            console.log("User Not Found At Login");
            return response_400(res, "User Does Not Exists");
        }

        if(password != result.password){
            console.log("Wrong Password At Login");
            return response_400(res, "Wrong Password");
        }
        // const userPass = await bcrypt.compare(result.password, password);
        console.log(result.password);

        // if(!userPass){
        //     console.log("Wrong Password At Login");
        //     return response_400(res, "Wrong Password");
        // }

        if(!jwtKey){
            return response_500(res, "Internal Server Error");
        }

        const user = {
            name: result.name,
            email: email,
            password: password,
        }

        const token = await generateToken(res, user);
        console.log(token);
        console.log("Login Successfull");
        return response_200(res, "Login Successful", {
                name: result.name,
                email: email,
                password: password,
                token: token,
        })
    }
    catch(error){
        console.log("Error At Login " + error);
        response_400(res, "Login Failed");
    }
})

router.route('/verifyOtp').post(async (req: Request, res: Response) => {
    try {
        const {otp, auth} = req.body; 
         // Find matching OTP
        const userRecord = dictionary.find(record => record.email == auth.email && record.otp == otp)
        if(userRecord){
            const newUser = new User({
                name: auth.name,
                email: auth.email,
                password: auth.password,
            })
            await newUser.save(); // Save the new user
            const idx = dictionary.indexOf(userRecord);
            if(idx > -1){
                dictionary.splice(idx, 1); // Remove used OTP from dictionary
            }
            return response_200(res, "Registered Successfully")
        }
        else{
            return response_400(res, "Invalid OTP");
        }
    }
    catch(error){
        console.log("Error At Verify OTP " + error);
        return response_400(res, "Verification Failed");
    }
})

router.route('/sendEmail').post(async (req: Request, res: Response) => {
    try {
        const {email} = req.body;
        
        sendEmail(res, email);
        return response_200(res, "Email Sent");
    }
    catch(error){
        console.log("Error At Send Email " + error);
        return response_400(res, "Error Occured");
            
    }
})

router.route('/forgotPassword').post(async (req: Request, res: Response) => {
    try {
        const {otp, email, newPassword} = req.body;
        const userRecord = dictionary.find(record => record.email == email && record.otp == otp);
        if(!userRecord){
            return response_400(res, "Invalid OTP");
        }
        if (!otp || !email || !newPassword) {
            return response_400(res, "Missing required fields");
        }
        const idx = dictionary.indexOf(userRecord);
        if(idx > -1){
            dictionary.splice(idx, 1);
        }
        const user = await User.findOne({email: email});
        if(!user){
            return response_400(res, "User Not Found");
        }
        user.password = newPassword;
        await user.save();
        return response_200(res, "Password Changed Successfully");
    }
    catch(error){
        console.log("Error At Forgot Password " + error);
        return response_400(res, "Error Occured")
            
    }
})

router.route('/editProfile').post(async (req : Request, res: Response) => {
    try {
        const { email, sem, branch, year, password } = req.body;

        const updateData: any = {};

        if (Number(sem) !== 0) {
            updateData.semester = Number(sem);
        }

        if (branch && branch !== "") {
            updateData.branch = branch;
        }

        if (Number(year) !== 0) {
            updateData.batch = Number(year);
        }

        if (password && password !== "") {
            updateData.password = password;
        }

       
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $set: updateData }, 
            { new: true } 
        );

        if (!updatedUser) {
            return response_400(res, "User Not Found");
        }
        return response_200(res, "Profile Edited Successfully", {
            name: updatedUser.name,
            branch: updatedUser.branch,
            semester: updatedUser.semester,
            batch: updatedUser.batch,
            email: updatedUser.email,
            password: updatedUser.password,
            imageUrl: updatedUser.imageUrl
        })
    }
    catch(error){
        console.log("Error At Edit Profile " + error);
        return response_400(res, "Error Occured")
    }
})

router.route('/signout').post(async (req: Request, res: Response) => {
    try {
        const {email} = req.body;
        const userExists = await User.findOne({email: email});
        if(!userExists){
            return response_400(res, 'User Does Not Exists');
        }
        res.clearCookie('token',  {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            path: '/',
        });
        return response_200(res, 'Signed Out Successfully')
    }
    catch(error){
        console.log("Error At Signout " + error);    
        return response_400(res, "Error Occured");
    }
})

export default router