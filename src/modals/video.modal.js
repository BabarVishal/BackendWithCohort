import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema(
{
  videofile:{
    type:String,
    require: true
  },
  thumbnail:{
    type:String,
    require:true
  },
  titel:{
    type:String,
    require:true
  },
  description:{
    type:String,
    require:true
  },
  duration:{
    type:Number,
    require:true
  },
  views:{
    type:Number,
    require:true
  },
  isPublished:{
    type:Boolean,
    default:true
  },
  owner:{
    type:Schema.types.ObjectID,
    ref:"User"
  }
},

{
    timestamps:true
})

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", VideoSchema)