import React, { useCallback, useState } from "react";
import _ from "lodash";
import { Delete } from "../func";
import axios from "axios";

function UserManage({manage}){
    if(!manage){ return <div> Loading ... </div>}
    else{
        return (
            <>
                {manage.map((userinfo, index) => {
                    return (
                        // <tr key={index}>
                        //     <td> {userinfo.code} </td>
                        //     <td> {userinfo.email} </td>
                        //     <td> {userinfo.name} </td>
                        //     <td> {userinfo.nick_name} </td>
                        //     <td> {userinfo.phone} </td>
                        //     <td> <EditUser userinfo={userinfo} /> </td>
                        // </tr>
                        <li key={index}>
                            <b> CODE : </b> <span> {userinfo.code} </span>
                            <b> ID : </b> <span> {userinfo.email} </span>
                            <b> Name : </b> <span> {userinfo.name} </span> 
                            <b> NickName : </b> <span> {userinfo.nick_name} </span>
                            <b> PhoneNumber : </b> <span> {userinfo.phone} </span>
                            <EditUser userinfo={userinfo} />
                        </li>
                    )
                })}
            </>
        )
    }
}

function EditUser({userinfo}){
    const [userAuth, setAuth] = useState(userinfo.auth);
    
    const setUser = useCallback( e => {
        setAuth(e.target.value);
    }, [])

    const setAdmin = useCallback( e => {
        setAuth(e.target.value);
    }, [])

    const editAuth = (e) => {
        axios.put(`/user/${userinfo.code}`, {
            data : {
                auth : userAuth
            }
        }).then(() => {
            alert("User's auth edited.");
        }).catch((e) => {
            alert("Failed to edit auth.\nPlease try again.");
            console.log(e.response);
        })
    }

    function authCheck({role}) {
        if(_.isEqual(userinfo.auth, role)){ return true; }
        else { return false; }
    }

    return (
        <div style={{position:"relative"}}>
            <form onSubmit={editAuth}>
                <b> ROLE : </b>
                <input className="w3-radio" type="radio" name="auth" value="ROLE_ADMIN" 
                    defaultChecked={authCheck({role:"ROLE_ADMIN"})}  onChange={setAdmin}/> ADMIN &nbsp;&nbsp;
                <input className="w3-radio" type="radio" name="auth" value="ROLE_USER"  
                    defaultChecked={authCheck({role:"ROLE_USER"})}  onChange={setUser}/> USER <br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" 
                        style={{position:"absolute", right:"100px", top:"3px"}}>Save</button>
            </form>
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                    style={{position:"absolute", right:"15px", top:"3px"}}
                    onClick={() => Delete("user",userinfo.code)}> Remove </button>
        </div>
    )
}

export default UserManage;