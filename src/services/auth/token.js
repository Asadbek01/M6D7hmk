import  HttpError  from "http-errors";
import { verifyJwt } from "./jwtTool.js";

 export const jwtAuthMiddleWare = async(req, res, next) =>{
     if(!req.headers.authorization){
         next(HttpError(401, "Please provide bearer token"))
     }else{
         try {
             const token = req.headers.authorization.replace("Bearer ", "")
             const payload = await verifyJwt(token)

             req.user = {
                 _id: payload._id,
                 role: payload.role
                }
               next()
            } catch (error) {
             next(HttpError(401, 'Token is invalid'))
         }
     }
 }