import mongoose, { Schema } from 'mongoose';

/**
 * Create database scheme for reports and responses
 */
const ResponseSchema = new Schema({
	responseMessage: {
		type: String,
        required: "What is the response message?"
	},
	senderName: {
		type: String,
        required: "What is the sender's name?"
	},
	date: {
		type: Date,
        default: new Date
	}
});
 
const ReportSchema = new Schema({
	userId: {
		type: String,
        required: "What is the report's id?"
	},
	reportMessage: {
		type: String,
        required: "What is the report's message?"
	},
	responses: {
		type: [ResponseSchema]
	},
	whoViewed: {
		type: [String]
	},
	date: {
		type: Date,
        default: new Date
	}
});

export default mongoose.model('Report', ReportSchema);