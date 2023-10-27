import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: "Api route is working!"
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account!"))
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {
            new: true
        });

        const {
            password, ...rest
        } = updatedUser._doc

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account!'))
    }
    try {
        await User.findByIdAndDelete(req.params.id);
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({
                userRef: req.params.id
            });

            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, "You can only view your own listings!"));
    }
} 

export const getOwnerContactInfo = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        return next(errorHandler(500, "Your don't get access your owner contact infomation"));
    }
    try {
        const userContact = await User.findById(req.params.id);
        return res.status(200).json(userContact);
    } catch (error) {
        next(error);
    }
}