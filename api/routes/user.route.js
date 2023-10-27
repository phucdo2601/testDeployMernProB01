import express from 'express';
import { deleteUser, getOwnerContactInfo, getUserListings, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get(`/test`, test);
router.post(`/update/:id`, verifyToken, updateUser)
router.post(`/delete/:id`, verifyToken, deleteUser)
router.get(`/listings/:id`, verifyToken, getUserListings)
router.get(`/getContactInfo/:id`, verifyToken, getOwnerContactInfo)

export default router;