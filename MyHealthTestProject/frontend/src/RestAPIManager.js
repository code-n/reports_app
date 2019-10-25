import * as URL from './data/URLs.json';
import API from './api';

// AUTHENTICATION : Login, Signup
export const login = (callback, username, password, setAuthTokens) => {
	const options = {
        headers: {
            'Access-Control-Allow-Credentials':true
        }
    }
	const params = {
	    "email" : username,
	    "password" : password
	}
    API.post(URL.Login, params, options)
    .then(result => {
        if (result.status === 200) {
            setAuthTokens({token:result.data.token, isAdmin:result.data.isAdmin, name:result.data.name});
            callback(true, false);
        } else {
            callback(false, true);
        }
    })
    .catch(e => {
        callback(false, true);
    });
}

export const register = (callback, username, password, firstname, lastname, setAuthTokens) => {
	const options = {
        headers: {
            'Access-Control-Allow-Credentials':true
        }
    }
	const params = {
	    "email" : username,
	    "password" : password,
		"name" : (firstname+" "+lastname)
	}
    API.post(URL.SignUp, params, options)
    .then(result => {
        if (result.status === 200) {
            setAuthTokens({token:result.data.token, isAdmin:result.data.isAdmin, name:result.data.name});
            callback(true, false);
        } else {
            callback(false, true);
        }
    })
    .catch(e => {
        callback(false, true);
    });
}

// USER (DOCTOR) : GetPatientsAndReports, PostResponse
export const getPatientsAndReports = (setDataCallback, setCounterCallback, errorCallback, authTokens) => {
	const options = {
        headers: {
            'x-access-token' : authTokens.token,
            'Access-Control-Allow-Credentials':true
        }
    }
    API.get(URL.GetAllPatientReports, options)
    .then(result => {
        if (result.status === 200) {
            setDataCallback(result.data);
            setCounterCallback(result.data.length);
        } else {
            errorCallback("Failed with status code -> "+result.status)
        }
    })
    .catch(e => {
        errorCallback(e);
    });
}

export const sendResponse = (Callback, authTokens, message, name, reportId) => {
	const options = {
        headers: {
            'x-access-token' : authTokens.token,
            'Access-Control-Allow-Credentials':true
        }
    }
    const params = {
        senderName : name,
	    responseMessage : message
	}
    API.post(URL.PostResponse + "/" + reportId, params, options)
    .then(result => {
        if (result.status === 200) {
            Callback(true, "");
        } else {
            Callback(false, "Failed with status code -> "+result.status);
        }
    })
    .catch(e => {
        Callback(false, e);
    });
}

// USER (PATIENT) : GetMyReports, CreateReport
export const getMyReports = (setDataCallback, setCounterCallback, errorCallback, authTokens) => {
	const options = {
        headers: {
            'x-access-token' : authTokens.token,
            'Access-Control-Allow-Credentials':true
        }
    }
    API.get(URL.GetMyReports, options)
    .then(result => {
        if (result.status === 200) {
            setDataCallback(result.data);
            setCounterCallback(result.data.length);
        } else {
            errorCallback("Failed with status code -> "+result.status)
        }
    })
    .catch(e => {
        errorCallback(e);
    });
}

export const sendReport = (Callback, authTokens, message) => {
	const options = {
        headers: {
            'x-access-token' : authTokens.token,
            'Access-Control-Allow-Credentials':true
        }
    }
    const params = {
	    "reportMessage" : message
	}
    API.post(URL.CreateReport, params, options)
    .then(result => {
        if (result.status === 200) {
            Callback(true, "");
        } else {
            Callback(false, "Failed with status code -> "+result.status);
        }
    })
    .catch(e => {
        Callback(false, e);
    });
}