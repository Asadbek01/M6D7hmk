import express from "express"
import AuthorModel from "./AuthorSchema.js"

import   { jwtAuth }  from "../auth/jwtTool.js"
import  { jwtAuthMiddleWare } from "../auth/JwtMiddleware.js"

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
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

router.put("/me", jwtAuthMiddleWare, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    updates.forEach(update => (req.author[update] = req.body[update]))
    await req.author.save()
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

router.delete("/me", jwtAuthMiddleWare, async (req, res, next) => {
  try {
    await req.author.deleteOne(res.send({"_id: ": req.author._id}))
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
    const tokens = await jwtAuth(user)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

export default router
