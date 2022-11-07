import React, { useState } from "react";
import _ from "lodash";
import { FetchWithoutId } from "../func";
import axios from "axios";

function UserManage(){
    const manage = Array.from(FetchWithoutId("user/manage").data);
    
    if(_.isEmpty(manage)){ return <div> Loading ... </div>}
    else{
        return (
            <>
            <div className="div-box">
                <b style={{fontSize: "30px"}}> User List </b>
                <ul>
                    {manage?.map((userinfo, index) => {
                        return (
                            <EditUser key={index} userinfo={userinfo} />
                        )
                    })}
                </ul>
                <button onClick={() => window.location.href="/mypage"}
                        className="w3-button w3-border w3-round-xlarge w3-small w3-hover-deep-purple"> Go to mypage →</button>
            </div>
            </>
        )
    }
}

function EditUser({userinfo}){
    const authList = ["ROLE_USER", "ROLE_ADMIN"];
    const [userAuth, setAuth] = useState(userinfo.auth.split("_")[1]);

    function changeAuth(){
        if(_.isEqual(userAuth, "USER")){
            setAuth(authList[1].split("_")[1]);
        }else{
            setAuth(authList[0].split("_")[1]);
        }
    }

    function editAuth(){
        axios.put(`/user/manage/${userinfo.code}`, {
            data : {
                auth : "ROLE_" + userAuth
            }
        }).then(() => {
            console.log("ROLE_" + userAuth);
            alert("User's auth edited.");
            window.location.reload();
        }).catch((e) => {
            alert("Failed to edit auth.\nPlease try again.");
            console.log(e.response);
        })
    }

    return (
        <>
            <li className="manage" >
                <td>{userinfo.code}</td>
                <td>{userinfo.email}</td>
                <td>{userinfo.name}</td>
                <td>{userinfo.nick_name}</td>
                <td>{userinfo.phone}</td>
                <td style={{width: "30%"}}>{userAuth} &nbsp; 
                    <input type={"image"} src={require("../change.png").default} alt={"icon"}
                        style={{width:"20px", verticalAlign: "middle"}}
                        onClick={() => {changeAuth()}} />
                    <button onClick={() => {editAuth()}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Save </button>
                </td>
            </li>
        </>
    )
}

export default UserManage;