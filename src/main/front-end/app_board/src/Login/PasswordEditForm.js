import { useState, useCallback } from "react";
import _ from "lodash";
import axios from "axios";

function PasswordEditForm({user}) {
    const [newPassword, setNewPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    
    const inputPassword = useCallback( e => {
        setNewPassword(e.target.value);
    }, [])
    
    const checkNewPassword = useCallback( e => {
        setCheckPassword(e.target.value);
    }, [])
    
    const changePW = (e) => {
        e.preventDefault();
        if(!_.isEqual(newPassword, checkPassword)){
            alert("Not matching password.\nTry again.")
            return Error;
        }
        
        axios.put(`/user`, {
            data : {
                email : user?.email,
                password : checkPassword,
                auth : user?.auth,
                nickName : user?.nick_name,
                name : user?.name,
                phone : user?.phone
            }
        }).then(() => {
            alert("Password Changed.\nPlease re-login.");
            sessionStorage.removeItem("isLogin");
            axios.post("/logout");
            window.location.replace(`/login`);
        }).catch((e) => {
            alert("Failed to change password.\n" + e.response.statusText);
            window.location.reload(); 
        })
    }

    if(!user){ return <div> Loading ... </div>}
    else{
        return (
            <form onSubmit={changePW} className="div-box" style={{marginTop: "0", height:"20%"}}>
                <b> Change password </b><br/>
                <input type={"password"} placeholder="New Password" onChange={inputPassword} required autoFocus></input><br/>
                <input type={"password"} placeholder="Check Password" onChange={checkNewPassword} required></input><br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Change </button>
            </form>
        )
    }
}

export default PasswordEditForm;