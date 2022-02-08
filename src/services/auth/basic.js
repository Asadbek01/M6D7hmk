import createHttpError from "http-errors";
import BlogPost from "../blogs/schema.js";
import atob  from 'atob'

export const mainMiddleware =  async(req, res, next) => {
    if (!req.headers.authorization){
        next(createHttpError(401, "You didnt provide Authorization Header"))
    }else {
        const base64 = req.headers.authorization.split(" ")[1]
        const credential = atob(base64)

        const [ name, password] = credential.split(":")
        const user = await BlogPost.checkCredential(name, password)
        console.log(user)
        if (user){
            req.user = user
            next()
        }else{
            next(createHttpError(401, "Error with name or password"))
        }


    }
}