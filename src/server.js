import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import passport from "passport"
import blogRouter from "./services/blogs/index.js"
import router from "./services/Author/index.js"
import { unauthorizedHandler, catchAllHandler, forbiddenHandler } from "./errorHandlers.js"
import geogleStrategy from "./services/auth/oath.js"

const server = express()

const port = process.env.PORT || 3001

// ******************************* MIDDLEWARES *************************************
passport.use("geogle", geogleStrategy)
server.use(cors())
server.use(express.json())
server.use(passport.initialize())

// ******************************** ROUTES *****************************************
server.use("/authors", router)
server.use("/blogs", blogRouter)

// ******************************** ERROR HANDLERS *********************************

server.use(unauthorizedHandler)
server.use(catchAllHandler)
server.use(forbiddenHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!")

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})
