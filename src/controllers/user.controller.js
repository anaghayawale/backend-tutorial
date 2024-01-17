import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { bodyDataExists, emailIsValid, passwordIsValid } from "../utils/validation/bodyData.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//----------------------------- Register User----------------------------
const registerUser = asyncHandler(async (req, res,next) => {
    const { email, username, fullName, password} = req.body;
    
    if(bodyDataExists(email, username, fullName, password)){
        throw new ApiError(400, "Incomeplete data");
    }

    if(!emailIsValid(email)){
        throw new ApiError(400, "Invalid email");
    }

    if(passwordIsValid(password)){
        throw new ApiError(400, "Invalid password");
    }

    const existingUser = await User.findOne({
        $or: [ { email },{ username }]
    })
    if(existingUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }
    const avatar =  await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(500, "Avatar upload failed");
    }

    const user = await User.create({
        email,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage.url,
        fullName,
        password,
    })
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!userCreated){
        throw new ApiError(500, "User registration failed");
    }

    res.status(201).json(new ApiResponse(200, userCreated, "User registered successfully"));
});

export { registerUser };