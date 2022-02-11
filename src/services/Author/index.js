import express from "express"
import AuthorModel from "./AuthorSchema.js"
import passport from "passport"

import   { jwtAuth, verifyRefreshTokenAndGenerateNewToken }  from "../auth/jwtTool.js"
import  { jwtAuthMiddleWare } from "../auth/JwtMiddleware.js"
import { HttpError } from "http-errors"

const router = express.Router()

router.get("/", jwtAuthMiddleWare,  async(req, res, next) => {
    try{
        const authors = await AuthorModel.find(req.query)
        res.send(authors)
    } catch(error){
        console.log(error)
        next(error)
    }
})

router.get("/me", jwtAuthMiddleWare, async (req, res, next) => {
  try {
    res.send(req.authors)
  } catch (error) {
    next(error)
  }
})

router.put("/me", jwtAuthMiddleWare, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    updates.forEach(update => (req.authors[update] = req.body[update]))
    await req.authors.save()
    res.send(req.authors)
  } catch (error) {
    next(error)
  }
})

router.delete("/me", jwtAuthMiddleWare, async (req, res, next) => {
  try {
    await req.authors.deleteOne(res.send({"_id: ": req.authors._id}))
  } catch (error) {
    next(error)
  }
})

router.post("/register", async (req, res, next) => {
  try {
    const newUser = new AuthorModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", jwtAuthMiddleWare, async(req, res, next) => {
    try{
        const id = req.params.id;
        const author = await AuthorModel.findById(id)
        if(author){
            res.send(author)
        } else {
            next('some error')
        }
    } catch (error){
        console.log(error)
        next(error)
    }
})

router.post("/login", async (req, res, next) => {
  try {
    const { name, password } = req.body
    const user = await AuthorModel.checkCredential(name, password)
    if(user){
        const {tokens, refreshToken} = await jwtAuth(user)
        res.send({tokens, refreshToken})
    }else{
        throw new HttpError(401, "Crediantials are not ok")
    }
} catch (error) {
    next(error)
  }
})  

router.post("/refreshToken", async(req, res, next) =>{
    try {
        const {currentRefreshToken} =req.body
        
        const {accessToken, refreshToken}= await verifyRefreshTokenAndGenerateNewToken(currentRefreshToken)
        res.send({accessToken, refreshToken})
        
    } catch (error) {
        next(error)
    }
})

router.get(
    "/googleLogin",
    passport.authenticate("google", { scope: ["profile", "email"] })
  ) // This endpoint receives Google Login requests from our FE, and it is going to redirect users to Google Consent Screen
  
  router.get(
    "/googleRedirect", // This endpoint URL should match EXACTLY the one configured on google.cloud dashboard
    passport.authenticate("google"),
    async (req, res, next) => {
      try {
        console.log("TOKENS: ", req.authors.tokens)
        // SEND BACK TOKENS
        res.redirect(
          `${process.env.FE_URL}?accessToken=${req.authors.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}`
        )
      } catch (error) {
        next(error)
      }
    }
  )

export default router
