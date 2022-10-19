import { useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import _ from "lodash";
import axios from "axios";

function PasswordEditForm({user}) {
    const [newPassword, setNewPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [, , removeCookie] = useCookies(['isLogin']);
    
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
            removeCookie(['isLogin']);
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
            <><br/>
            <form onSubmit={changePW}>
                <div id="div-box">
                    <b> Change password </b><br/>
                    <input type={"password"} placeholder="New Password" onChange={inputPassword} required autoFocus></input><br/>
                    <input type={"password"} placeholder="Check Password" onChange={checkNewPassword} required></input><br/>
                    <button type="submit" id="btn-post"> Change </button>
                </div>
            </form> </>
        )
    }
}

export default PasswordEditForm;