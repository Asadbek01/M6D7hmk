import  HttpError  from "http-errors";
import { verifyJwt } from "./jwtTool.js";


 export const jwtAuthMiddleWare = async(req, res, next) =>{
     if(!req.headers.authorization){
         next(HttpError(401, "Please provide bearer token"))
     }else{
         try {
             console.log("here")
             const token = req.headers.authorization.replace("Bearer ", "")
             const payload = await verifyJwt(token)

             req.authors = {
                 _id: payload._id,
                 name: payload.name
                }
             next()
            } catch (error) {
                console.log(error)
             next(HttpError(401, 'Token is invalid'))
         }
     }
 }