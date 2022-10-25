import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordEditForm from "../Login/PasswordEditForm";
import { isAdmin } from "../func";
import MyArticles from "./MyArticles";
import MyComments from "./MyComments";

function MyPage({user}){
    const [visible, setVisible] = useState(false);
    if(!user) { return <div> Loading ... </div> }
    else {
        return (
            <div id="div-box">
                <b style={{ fontSize: "40px"}}>MY PAGE</b> <hr/>
                <div style={{textAlign: "left",padding: "10px", margin: "20px", marginBottom: 0}}>
                    <b> Name : </b><span> {user.name} </span><br/>
                    <b> Email : </b><span> {user.email} </span><br/>
                    <b> Nickname : </b><span> {user.nick_name} </span><br/>
                    <b> PhoneNumber : </b><span> {user.phone} </span><br/><br/>
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" 
                            style={{position: "absolute", top: "115px", right: "30px"}}
                            onClick={() => setVisible(!visible)}> {visible ? "Cancel" : "Change PW"} </button>
                    {visible && <PasswordEditForm user={user}/>}
                </div><hr/>
                <div className="box1"><MyArticles /></div>
                <div className="box2"><MyComments /></div>
                <div style={{position: "absolute", top: "160px", right: "30px"}}>
                    {isAdmin(user?.auth) && 
                        <Link to={"/user"} id="none">
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red">Manage users</button>
                        </Link>}
                </div>
            </div>
        )
    }
}

export default MyPage;