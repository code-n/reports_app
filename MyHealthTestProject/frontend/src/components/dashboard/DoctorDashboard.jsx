import React, {useState, useEffect} from 'react';
import '../../App.css';
import { useAuth } from "../../context/auth";
import { getPatientsAndReports, sendResponse } from '../../RestAPIManager';

const App = props => {
  // STATE
  const [data, setData] = useState();
  const [showReplies, setShowReplies] = useState({state:{"showing":false}, style:{"display":"none"}});
  const [showResponses, setShowResponses] = useState({state:{"showing":false}, style:{"display":"none"}});
  const [patientCounter, setCounter] = useState(0);
  const [reportId, setReportId] = useState("");
  const { setAuthTokens, authTokens } = useAuth();

  const [replyText, setReplyText] = useState("View Reports");
  const [responsesText, setViewResponseText] = useState("View Responses");

  const logOut = () => {
	  localStorage.removeItem("logged_in");
      setAuthTokens();
  }
  
  // CALL REPORTS API
  useEffect(() => {
    getPatientsAndReports(setData, setCounter, (error_message) => {
      console.log(error_message);
    }, authTokens);
  });

  // POST RESPONSE
  const submitHandler = (event) => {
    event.preventDefault();
    
    sendResponse((success, error_message) => {
      success ? alert("response has bent sent..") : alert(error_message);
    }, authTokens, window.value, authTokens.name, reportId);
  }

  // SETUP RESPONSE
  const changeHandler = (event) => {
	window.value = (event.target.value);
	setReportId(event.target.id);
  }
  
  // OPEN OR HIDE REPORTS
  const changeState = (event) => {
	if(!showReplies.state.showing){
  		setShowReplies({target:event.target.id, state:{"showing":true}, style:{"display":"block"}});
  		setReplyText("Hide Reports");
  	}else{
  		setShowReplies({target:event.target.id, state:{"showing":false}, style:{"display":"none"}});
  		setReplyText("View Reports");
  	}
  }
  
  // OPEN OR HIDE REPLIES
  const changeRepliesState = (event) => {
  	if(!showResponses.state.showing){
  		setShowResponses({target:event.target.id, state:{"showing":true}, style:{"display":"block"}});
  		setViewResponseText("Hide Responses");
  	}else{
  		setShowResponses({target:event.target.id, state:{"showing":false}, style:{"display":"none"}});
  		setViewResponseText("View Responses");
  	}
  }

  return data ? (
    <div className="App flex center">
      <div className="container">
        <div className="card">
          <div className="flex">
            <div className="inline d-left">Doctor Dashboard</div>
            <div className="inline d-right">
			  <button onClick={logOut} >logout</button>
            </div>
          </div>
          <hr className="opa-fade"/>
          <div className="flex" style={{marginTop:16}}>
            <div className="inline d-left" style={{fontSize:24}}>Patients</div>
            <div className="inline d-right" style={{color:"#b1b1b1"}}>
              <span>{patientCounter}</span> patients
            </div>
          </div>
        </div>
        <ul style={{listStyleType:"none"}}>
			{(data.reverse()).map((patient) => {
            return (
              <li>
                <div className="card" style={{marginTop:20, paddingLeft:50, paddingRight:50}}>
				  <div style={{display:"inline-block"}}>
                  <p className="flex" style={{flexGrow:1}}>
                    {patient.name}
                  </p>
                  <div><span style={{color:"#666666", fontSize:14}}><span>{patient.reports.length}</span> reports</span></div>
				  </div>
                  <hr className="opa-fade"/>
                  <div style={(showReplies.target == patient.id ? showReplies.style : {"display":"none"})}>
                    <ul>
					  {(patient.reports.reverse()).map((report) => {
						return (
                          <li>
							<div style={{display:"inline-flex", width:"100%"}}>
								<div style={{display:"inline-flex", flexDirection:"column"}}>
									<div style={{display:"inline-block"}}><span style={{color:"#666666", fontSize:14}}>reported on {(new Date((report.date.split("T")[0])).getDay())+"/"+(new Date((report.date.split("T")[0])).getMonth())+"/"+(new Date((report.date.split("T")[0])).getFullYear())}</span></div>
									<p className="flex" style={{flexGrow:1}}>
										{(report.reportMessage)}
									</p>
								</div>
								<div style={{alignSelf:"center", marginLeft:"auto", paddingRight:8}}>
									<button id={report._id} onClick={changeRepliesState} style={{border: "1px solid Red", backgroundColor:"white", color:"red", padding:"8px 14px", cursor:"pointer"}}>
									{(showResponses.target == report._id ? responsesText : "View Responses")}
									</button>
								</div>
							</div>
							<div style={(showResponses.target == report._id ? showResponses.style : {"display":"none"})} className="card">
								<form onSubmit={submitHandler} className="flex" style={{flexGrow:1}}>
									<input id={report._id} type="text" onChange={changeHandler} placeholder="type your response here..." style={{padding:10,flexGrow:1}}/>
									<button>Submit</button>
								</form>
							</div>
							<hr className="opa-fade"/>
							<ul className="mt-20" style={(showResponses.target == report._id ? showResponses.style : {"display":"none"})}>
							 {(report.responses.reverse()).map((response) => {
						       return (
								<li style={{marginLeft:30}}>
									<div style={{display:"inline-flex", width:"100%"}}>
										<div style={{display:"inline-flex", flexDirection:"column"}}>
											<div style={{display:"inline-block"}}><span style={{color:"#666666", fontSize:14}}>reply from Dr {(response.senderName)}</span>  <span style={{color:"#666666", fontSize:14, marginLeft:"auto"}}> on {(new Date((response.date.split("T")[0])).getDay())+"/"+(new Date((response.date.split("T")[0])).getMonth())+"/"+(new Date((response.date.split("T")[0])).getFullYear())}</span></div>
											<p className="flex" style={{flexGrow:1}}>
												{(response.responseMessage)}
											</p>
										</div>
									</div>
								</li>
							  )})}
							</ul>
                          </li>
					  )})}
					</ul>
                  </div>
				  <hr className="opa-fade" style={(showReplies.target == patient.id ? showReplies.style : {"display":"none"})}/>
				  <div>
				  	<button id={patient.id} onClick={changeState} style={{padding:"8px 14px"}}> {(showReplies.target == patient.id ? replyText : "View Reports")} </button>
				  </div>
                </div>
              </li>
			)})}
        </ul>
      </div>
    </div>
  ) : <h1>Loading...</h1>;
}

export default App;