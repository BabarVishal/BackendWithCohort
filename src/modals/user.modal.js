const mongoose = require('mongoose');
import { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from "bcrypt" 

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      fullname: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      profilePicture: {
        type: String,
        default: 'default.jpg' // You can set a default profile picture
      },
      subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to other users who have subscribed to this user
      }],
      subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to other users whom this user has subscribed to
      }],
      videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video' // Reference to the videos uploaded by this user
      }],
      playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist' // Reference to playlists created by this user
      }],
      dateJoined: {
        type: Date,
        default: Date.now
      }
},
{
    timestamps:true
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methode.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password, this.password)
}

userSchema.methode.generateAccessToken = function(){
    JsonWebTokenError.sing({
      _is : this._id,
      email : this.email,
      username:this.usename,
      fullname:this.fullname 
    },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
   }
)
}

userSchema.methode.generateRefreshToken = function(){
    JsonWebTokenError.sing({
        _is : this._id,
      
      },
     process.env.REFRESH_TOKEN_SECRET,
     {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
     }
  )
}

const HostelBoys = mongoose.model('hostelboys', user);

module.exports = HostelBoys;