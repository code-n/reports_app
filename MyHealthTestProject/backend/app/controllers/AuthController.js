import User from '../models/UserModel.js';
import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config/default.json';

const router = express.Router();

// REGISTERS NEW USERS
router.post('/register', async (req, res) => {
	//	FINDS EXISTING USERS THEN PROCEEDS
	try{
		if(!req.body.email && !req.body.password && !req.body.name) throw "Oops! you forgot the parameters: name, email, and password";
		
		const existing_user = await User.findOne({ email: req.body.email });
		if (existing_user) return res.status(400).send("User already registered.");
		
		const hashedPassword = bcrypt.hashSync(req.body.password, 8);
		const user = new User({
			name : req.body.name,
			email : req.body.email,
			password : hashedPassword,
			isAdmin : req.body.isAdmin
		});
		user.save((err, user_info) => {
			if (err) {
				res.status(500).send(err);
			}else {
				// CREATES A TOKEN
				const token = jwt.sign({ id : user._id, isAdmin : user.isAdmin }, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				res.status(200).send({ auth: true, token: token });
			}
		});
	}catch(e){
		res.send(e);
	}
});

// CHECKS USER LOGIN
router.post('/login', (req, res) => {
	try{
		if(!req.body.email && !req.body.password) throw "Oops! you forgot the parameters: name, email";
		
		User.findOne({ email: req.body.email }, (err, user) => {
			if (err) return res.status(500).send('Error on the server.');
			if (!user) return res.status(404).send('No user found.');
			
			const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
			
			const token = jwt.sign({ id: user._id }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
			});
			
			res.status(200).send({ auth: true, token: token, isAdmin: user.isAdmin, name: user.name });
		});
	}catch(e){
		res.send(e);
	}
});

export default router;
