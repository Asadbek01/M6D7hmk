import { HttpError } from "http-errors";
import  jwt from "jsonwebtoken"
import AuthorSchema from "../Author/AuthorSchema.js";

export const jwtAuth = async authors =>{
     try {
          const accesstoken = await generateJwtToken({_id: authors._id});
          const refreshToken = await generateRefreshToken({id: authors._id})
       authors.refreshToken = refreshToken
       await authors.save()



          return {accesstoken, refreshToken};
          
     } catch (error) {
          return error
     }
} 



const env = process.env.JWT_SECRET
console.log(env)



 const generateJwtToken = payload => 
new Promise((rejected, resolved) =>
jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: "15m"}, (err, token)=>{
if (err)  rejected(err)
else resolved(token)
})
)

const generateRefreshToken = payload => 
new Promise((rejected, resolved) =>
jwt.sign(payload, process.env.REFRESH_TOKEN,{ expiresIn: "1 week"}, (err, token)=>{
if (err)  rejected(err)
else resolved(token)
})
)


 export const verifyJwt = token =>
new Promise((reject, resolve) =>
jwt. verify( token, process.env.JWT_SECRET, (err, payload)=>{
if(err) reject(err)
else resolve(payload)
})

)
export const verifyRefreshToken = token =>
new Promise((reject, resolve) =>
jwt. verify( token, process.env.REFRESH_TOKEN, (err, payload)=>{
if(err) reject(err)
else resolve(payload)
})

)

export const verifyRefreshTokenAndGenerateNewToken = async currentRefreshToken =>{
     try {
          const payload = await verifyRefreshToken(currentRefreshToken)
          const author = await AuthorSchema.findById(payload._id)
       if(!author){
            throw new HttpError(404, `Author with id ${payload._id} didnt find`)
       }
       if(author.refreshToken && author.refreshToken === currentRefreshToken){
            const {accesstoken, refreshToken} = await jwtAuth(author)
            return {accesstoken, refreshToken}
       }else{
            throw new HttpError(401, "Refresh token not valid!")
       }
          } catch (err) {
               throw new HttpError(401, "Refresh token expired!")
     }
}