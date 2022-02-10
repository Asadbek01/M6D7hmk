import  jwt from "jsonwebtoken"

export const jwtAuth = async(user) =>{
     const accesstoken = await generateJwtToken({_id: user._id});
     return accesstoken;
} 



const env = process.env.JWT_SECRET



 const generateJwtToken = payload => 
new Promise((rejected, resolved) =>

jwt.sign(payload, env,{ expiresIn: "15min"}, (err, token)=>{
if (err)  rejected(err)
else resolved(token)
})
)


 export const verifyJwt = token =>
new Promise((reject, resolve) =>
jwt. verify( token, env, (err, payload)=>{
if(err) reject(err)
else resolve(payload)
})

)