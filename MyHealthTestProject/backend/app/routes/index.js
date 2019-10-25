import ReportController from '../controllers/ReportController';
import AuthController from '../controllers/AuthController';

export default (app) => {
	// AUTHENTICATION ROUTES
	app.use('/api/auth', AuthController);
	
	// API RESOURSES ROUTES
	app.use('/api/reports', ReportController);
};

