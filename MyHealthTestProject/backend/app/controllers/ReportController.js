import mongoose from 'mongoose'; 
import Report from '../models/ReportModel';
import VerifyToken from '../middleware/VerifyToken';
import bodyParser from 'body-parser';
import express from 'express';
import User from '../models/UserModel.js';

const router = express.Router();

// CREATES A NEW REPORT
router.post('/create', VerifyToken, (req, res) => {	
	const report = new Report({
		userId : req.userId,
		reportMessage : req.body.reportMessage
	});
    report.save((err, report_info) => {
		if(!err)
		{
			res.send(report_info);
		}
		
		if (err) {
            res.status(500).send(err);
        }
    });
});

// RETURNS ALL THE REPORTS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {	
    Report.find({}, (err, users) => {
		if(!err){
			res.status(200).send(users);
		}
    });
});

// RETURNS ALL THE PATIENTS AND THEIR IN THE DATABASE
router.get('/sorted', VerifyToken, (req, res) => {	
	// FILTER OUT PATIENTS AND THEIR RECORDS
    User.find({}, async (err, users) => {
		const sorted_reports = [];
		
		for(const index in users)
		{
			const user = users[index];
			
			const data = await new Promise((resolve) => {
				Report.find({userId : user._id}, (err, report) => {
				resolve({name : user.name, id : user._id, reports : report});
				});
			});

			sorted_reports.push(data)
		}
		
        res.status(200).send(sorted_reports);
    });
});

// GETS A SINGLE USER'S REPORTS FROM THE DATABASE
router.get('/single-user', VerifyToken, (req, res) => {
    Report.find({userId : req.userId}, (err, user) => {
        if (!user) {
			return res.status(404).send("No user found.");
		}
        res.status(200).send(user);
    });
});

// GETS A SINGLE REPORT FROM THE DATABASE
router.get('/:reportId', VerifyToken, (req, res) => {
    Report.findOne({_id : req.params.reportId, userId : req.userId}, (err, user) => {
        if (!user) {
			return res.status(404).send("No user found.");
		}
        res.status(200).send(user);
    });
});

// CREATES A NEW RESPONSE
router.post('/:reportId', VerifyToken, (req, res) => {
	//if (!req.isAdmin) res.status(404).send("You don't have authorization to access this resource.");
	console.log(req.body);
	Report.findByIdAndUpdate(req.params.reportId, { $push : {"responses": req.body}}, {safe:true, upsert:true}, (err, response_info) => {

        res.status(200).send(response_info);
    });
});

export default router;