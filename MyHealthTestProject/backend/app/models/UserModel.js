import mongoose, { Schema } from 'mongoose';

/**
 * Create database scheme for users
 */
const UserSchema = new Schema({
	name: {
		type: String,
        required: "What is the user's name?"
	},
	email: {
		type: String,
		required: "What is the user's email",
		minlength: 5,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: "What is the user's password",
		minlength: 3,
		maxlength: 255
	},
	// Give different access rights if admin or not
	isAdmin: {
        type: Boolean,
		default: false
    },
	date: {
		type: Date,
        default: new Date
	}
});

export default mongoose.model('User', UserSchema);