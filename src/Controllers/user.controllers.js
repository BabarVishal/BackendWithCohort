import { asyncHandler } from "../utils/asyncHanderl.js";
import { User } from "../modals/user.modal.js";

const generateAccessTokenandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        // Generate access token and refresh token using user methods
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong!");
    }
};


// Register a new user
const handleRegisterUser = asyncHandler(async (req, res) => {
    try {
        // Extract user data from request body
        const { username, password, fullname, email } = req.body;

        // Check if required fields are provided
        if (!username || !password || !fullname || !email) {
            return res.status(400).json({ error: 'Please provide all required fields: username, password, fullname, email' });
        }

        // Create a new user instance
        const newUser = new User({
            username,
            password,
            fullname,
            email
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Send response
        console.log('User saved');
        res.status(200).json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users
const handleGetAllUser = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        console.log('Users fetched');
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const handleLoginUser = asyncHandler(async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Please provide both username and password' });
        }
        // Find the user in the database by username
        const user = await User.findOne({ username });
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the password is correct using the isPasswordCorrect method
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Generate access token and refresh token
        const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

        // Set options for cookies
        const options = {
            httpOnly: true,
            secure: true
        };

        // Set cookies in the response
        res.cookie('accessToken', accessToken, options);
        res.cookie('refreshToken', refreshToken, options);

        // Return success response
        return res.status(200).json({
            user: user,
            message: "User logged in successfully!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const logOutUser = asyncHandler(async (req, res) => {
    try {
        // Clear refresh token in the database
        await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } });

        // Clear cookies
        const options = {
            httpOnly: true,
            secure: true
        };
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);

        // Return success response
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




const changeCurrentPassword = asyncHandler( async(req, res)=>{
      const {oldpassword, newpassword} = req.body;
       const user = User.findById(req.user?._id);
       const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);
       if (!isPasswordCorrect) {
          throw new ApiError(400, "Invalid old password");
       }
       user.password = newpassword;
       await user.save({validateBeforeSave: false});

       return res.status(200).json({mas: "Password Change Succcessfully"});
})

const getcurrentuser = asyncHandler(async (req, res)=>{
    return res.status(200).json(req.user, "current user fetched successfully")
})

const userChannelProfile = asyncHandler(async (req,res) =>{
     
   const {username} = req.params;
    if (!username?.trim) {
        throw new ApiError(400, "Username is Missing");
    }
   const Channel =  await User.aggregate([
    {
        $match:{
            username: username?.toLowerCase()
        }
    },
    {
        $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscrbers"
        }
    },
    {
        $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscribers",
            as: "subscrbersTo"
        }
    },
    {
        $addFields:{
            subscribersCount: {
                $size: "$subscrbers"
            },
            channelsubscrbersToCount: {
             $size : "$subscrbersTo"
            },
            issubscrbers: {
              $cond:{
                if:{$in: [req.user?.id, "$subscrbers.subscrbers"]},
                then: true,
                else:false
              }
            }
        }
    },
   ])
})

// Export the router
export { 
    handleRegisterUser,
    handleGetAllUser,
    handleLoginUser,
    logOutUser
 };


 