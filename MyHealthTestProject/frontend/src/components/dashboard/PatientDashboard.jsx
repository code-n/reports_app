import React, {useState, useEffect} from 'react';
import '../../App.css';
import { useAuth } from "../../context/auth";
import { getMyReports, sendReport } from '../../RestAPIManager';

const Dashboard = props => {
  // STATE
  const [data, setData] = useState();
  const [showReplies, setShowReplies] = useState({state:{"showing":false}, style:{"display":"none"}});
  const [reportCounter, setCounter] = useState(0);
  const { setAuthTokens, authTokens } = useAuth();

  const [replyText, setReplyText] = useState("View Replies");

  const logOut = () => {
    setAuthTokens();
  }

  // CALL REPORTS API
  useEffect(() => {
    getMyReports(setData, setCounter, (error_message) => {
      console.log(error_message);
    }, authTokens);
  });

  // OPEN OR HIDE REPLIES
  const changeState = (event) => {
    if(!showReplies.state.showing){
      setShowReplies({target:event.target.id, state:{"showing":true}, style:{"display":"block"}});
      setReplyText("Hide Replies");
    }else{
      setShowReplies({target:event.target.id, state:{"showing":false}, style:{"display":"none"}});
      setReplyText("View Replies");
    }
  }

  // POST REPORT
  const submitHandler = (event) => {
    event.preventDefault();
    
    sendReport((success, error_message) => {
      success ? alert("report has bent sent..") : alert(error_message);
    }, authTokens, window.value);
  }

  // SET REPORT MESSAGE
  const changeHandler = (event) => {
    window.value = event.target.value;
  }

  return data ? (
    <div className="App flex center">
      <div className="container">
        <div className="card">
          <div className="flex">
            <div className="inline d-left">Patient Dashboard</div>
            <div className="inline d-right">
              <button onClick={logOut} >logout</button>
            </div>
          </div>
          <hr className="opa-fade"/>
          <div className="flex" style={{marginTop:16}}>
            <div className="inline d-left" style={{fontSize:24}}>Reports</div>
            <div className="inline d-right" style={{color:"#b1b1b1"}}>
              <span>{reportCounter}</span> reports
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop:20}}>
          <form className="flex" onSubmit={submitHandler} style={{flexGrow:1}}>
            <input type="text" required onChange={changeHandler} placeholder="type your report here..." style={{padding:10,flexGrow:1}}/>
            <button>Submit</button>
          </form>
        </div>
        <ul style={{listStyleType:"none"}}>
          {(data.reverse()).map((report) => {
            return (
              <li>
                <div className="card" style={{marginTop:20, paddingLeft:50, paddingRight:50}}>
                  <p className="flex" style={{flexGrow:1}}>
                    {(report.reportMessage)}
                  </p>
                  <div><span style={{color:"#666666", fontSize:14}}>{(new Date((report.date.split("T")[0])).getDay())+"/"+(new Date((report.date.split("T")[0])).getMonth())+"/"+(new Date((report.date.split("T")[0])).getFullYear())}</span></div>
                  <hr className="opa-fade" style={(showReplies.target == report._id ? showReplies.style : {"display":"none"})}/>
                  <div style={(showReplies.target == report._id ? showReplies.style : {"display":"none"})}>
                    <ul>
                      {report.responses.map((response) => {
                        return (
                          <li>
                            <div><span style={{color:"#666666", fontSize:14}}>reply from Dr {(response.senderName)}</span>  <span style={{color:"#666666", fontSize:14, marginLeft:"auto"}}> on {(new Date((response.date.split("T")[0])).getDay())+"/"+(new Date((response.date.split("T")[0])).getMonth())+"/"+(new Date((response.date.split("T")[0])).getFullYear())}</span></div>
                            <p className="flex" style={{flexGrow:1}}>
                              {(response.responseMessage)}
                            </p>
                          </li>
                        )})}
                    </ul>
                  </div>
                  <hr className="opa-fade"/>
                  <div>
                    <button id={report._id} onClick={changeState}><span style={{backgroundColor:"#444444", color:"white", borderRadius:50, padding:6, display:"inline-block", marginRight:6}}>{(report.responses.length)}</span> {(showReplies.target == report._id ? replyText : "View Replies")} </button>
                  </div>
                </div>
              </li>
            )})}
        </ul>
      </div>
    </div>
  ) : (<div>loading...</div>);
}

export default Dashboard;