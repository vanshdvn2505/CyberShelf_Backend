import express from "express"
const router = express.Router();
import { Request, Response } from "express";
import { response_200, response_400, response_500 } from "../utils/responseCodes.utils";
import SemWiseSub from "../models/semWiseSub.model";

router.route('/semvisesubject').get(async (req: Request, res: Response) => {
    try {
        const data = await SemWiseSub.find();
        if(!data){
            return response_400(res, "Data Not Found");
        }

        return response_200(res, "Data Found Successfully", data);
    }
    catch(error){
        console.log("Error At SemWiseSub " + error);
        return response_400(res, "Error Occured");
    }
})

export default router;