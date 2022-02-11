import passport from "passport";
import  GeogleStrategy from "passport-google-oauth20";
import AuthorSchema from "../Author/AuthorSchema.js";
import { jwtAuth } from "./jwtTool.js";

const geogleStrategy = new GeogleStrategy(
    {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleRedirect`,
    },
    async(accessToken, refreshToken, profile, passportNext)=>{

       console.log('Profile: ', profile)
        try {
            const author = await AuthorSchema.findOne()

            if(author){
                const tokens = await jwtAuth(author)
                passportNext(null, {tokens})
            }else{
                const newUser = new UsersModel({
                    name: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                  })
                  const savedUser = await newUser.save()
                  const tokens = await jwtAuth(savedUser)
            }
            passportNext(null, {tokens})
        } catch (error) {
            
        }
    }
)
passport.serializeUser(function(data, passportNext){
    passportNext(null,data)
})
export default geogleStrategy