import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt" 

const userSchema = new mongoose.Schema({
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
      },
      refreshToken:{
        type:"String"
      }
},
{
    timestamps:true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method to check if password is correct
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to generate access token
userSchema.methods.generateAccessToken = function() {
  return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname 
  }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
  });
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({
      _id: this._id,
  }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};

export const User = mongoose.model('User', userSchema);