import express from "express"
import createHttpError from "http-errors"
import { mainMiddleware } from "../auth/basic.js"
import { jwtAuth } from "../auth/jwtTool.js"
import { OwnerMiddleware } from "../auth/owner.js"
import { jwtAuthMiddleWare } from "../auth/token.js"
import BlogPost from "./schema.js"

const blogRouter = express.Router()

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogPost(req.body) 
    const { _id } = await newBlog.save() 

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogRouter.get("/",jwtAuthMiddleWare, async (req, res, next) => {
  try {
    const blogs = await BlogPost.find()
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.get("/:blogId", mainMiddleware, async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const blog = await BlogPost.findById(blogId)
    if (blog) {
      res.send(blog)
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put("/:blogId", mainMiddleware, OwnerMiddleware, async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const UpdateBlog = await BlogPost.findByIdAndUpdate(blogId, req.body)
    if (UpdateBlog) {
      res.send(UpdateBlog)
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.delete("/:blogId", mainMiddleware, async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const deleteBlog = await BlogPost.findByIdAndDelete(blogId)
    if (deleteBlog) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
blogRouter.post("/login", async (req, res, next) => {
  try {
    const { name, password } = req.body

    const user = await BlogPost.checkCredential(name, password)

    if (user) {
      const accessToken = await jwtAuth(user)
      console.log("accdscsdc",accessToken)
      res.send({ accessToken })
    } else {
      next(createHttpError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

//*************************Owner Routes***********************//
export default blogRouter