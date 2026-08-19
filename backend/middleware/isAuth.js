import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: token not found"
            });
        }

        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("this is verifyToken", verifyToken);

        const findUser = await User.findById(verifyToken.id);

        if (!findUser) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.userId = findUser._id;

        next();

    } catch (error) {
        console.error("isAuth error", error);

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};

export default isAuth;
