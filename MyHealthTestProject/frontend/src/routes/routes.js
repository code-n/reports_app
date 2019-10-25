import React, {useState} from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './privateRoute';
import {AuthContext, AdminContext} from '../context/auth';
import Login from '../components/login/Login';
import SignUp from '../components/signup/SignUp';
import NotFound from '../components/notfound/NotFound';

//dashboard imports
import DoctorDashboard from '../components/dashboard/DoctorDashboard';
import PatientDashboard from '../components/dashboard/PatientDashboard';


// urls
function Routes (props) { 
    const [authTokens, setAuthTokens] = useState();

    const setTokens = (data) => {
        localStorage.setItem("tokens", JSON.stringify(data));
        setAuthTokens(data);
    }

    return (
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
			<Router>
				<Switch>
					<Route exact path="/" component={Login}/>
					<Route exact path="/signup" component={SignUp}/>
					<PrivateRoute exact path="/dashboard/patient" component={PatientDashboard}/>
					<PrivateRoute exact path="/dashboard/doctor" component={DoctorDashboard}/>
					<Route component={NotFound}/>
				</Switch>
			</Router>
        </AuthContext.Provider>
    );
}

export default Routes;