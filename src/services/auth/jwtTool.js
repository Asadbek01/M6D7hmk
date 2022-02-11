import  jwt from "jsonwebtoken"

export const jwtAuth = async authors =>{
     const accesstoken = await generateJwtToken({_id: authors._id});
     return accesstoken;
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


 export const verifyJwt = token =>
new Promise((reject, resolve) =>
jwt. verify( token, process.env.JWT_SECRET, (err, payload)=>{
if(err) reject(err)
else resolve(payload)
})

)