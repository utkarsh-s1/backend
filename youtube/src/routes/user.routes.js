import { Router } from "express";
import { changePassword, getCurrentUser, getUserProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middleswares/multer.middleware.js";
import { verifyJWT } from "../middleswares/auth.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        },
    ]), registerUser)


router.route("/login").post(loginUser)

// secure routes

router.route("/logout").post(verifyJWT, logOutUser)

router.route('/refresh').post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changePassword)

router.route('/current-user').get(verifyJWT, getCurrentUser)

router.route('/update-account').patch(verifyJWT, updateAccountDetails)

router.route('/update-avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar)

router.route('/update-cover-image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage)

router.route('/user-profile/:username').get(verifyJWT, getUserProfile)

router.route('/history').get(verifyJWT, getWatchHistory)


export default router