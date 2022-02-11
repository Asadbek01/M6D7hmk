import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const AuthorModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
    type: String,
    required: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        enum: "https://placehold.it/60x60"
    },
    email:{
        type: String,
        required: true
    }
});

AuthorModel.methods.toJSON = function () {
    const author = this
    const authorObject = author.toObject()
  
    delete authorObject.password
    delete authorObject.__v
  
    return authorObject
  }
  
  AuthorModel.statics.checkCredential = async function(name, password) {
    const author = await this.findOne({ name })
    console.log(author)
  
    if (author) {
      const isMatch = await bcrypt.compare(password, author.password)
      if (isMatch) return author
      else return null
    } else {
      return null
    }
  }
  
  AuthorModel.pre("save", async function (next) {
    const author = this
    const plainPW = author.password
  
    if (author.isModified("password")) {
      author.password = await bcrypt.hash(plainPW, 10)
    }
    next()
  })


export default model("Author", AuthorModel) 
