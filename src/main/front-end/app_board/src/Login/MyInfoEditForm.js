import { useState, useCallback } from "react";
import _ from "lodash";
import axios from "axios";
import { autoHypenTel } from "../func";
import { Logout } from "../Bar";

function MyInfoEditForm({user}) {
    const [newPhone, setNewPhone] = useState(user.phone);
    const [newNickname, setNewNickname] = useState(user.nick_name);
    const [newPassword, setNewPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    
    const inputNickname = useCallback( e => {
        if(!_.isEmpty(e.target.value)){
            setNewNickname(e.target.value);
        }else{
            setNewNickname(user.nick_name);
        }
    }, [user.nick_name])

    const inputPassword = useCallback( e => {
        if(!_.isEmpty(e.target.value)){
            setNewPassword(e.target.value);
        }
    }, [])
    
    const checkNewPassword = useCallback( e => {
        if(!_.isEmpty(newPassword)){
            if(!_.isEmpty(e.target.value)){
                e.target.required = true;
            }
            setCheckPassword(e.target.value);
        }
    }, [newPassword])

    const inputPhone = useCallback( e => {
        if(!_.isEmpty(e.target.value)){
            setNewPhone(autoHypenTel(e.target.value));
        }else{
            setNewPhone(user.phone);
        }
    }, [user.phone])
    
    const changePW = (e) => {
        e.preventDefault();
        if(!_.isEmpty(checkPassword) && !_.isEqual(newPassword, checkPassword)){
            // alert("Not matching password.\nTry again.");
            alert("비밀번호가 서로 맞지 않습니다.\n 다시 확인해주세요.");
            return Error;
        }
        if(!_.isEmpty(newNickname)){
            setNewNickname(user.nick_name);
        }
        
        axios.put(`/user`, {
            data : {
                email : user.email,
                name : user.name,
                auth : user.auth,
                password : checkPassword,
                nickName : newNickname,
                phone : newPhone
            }
        }).then(() => {
            // alert("User Information Changed.\nPlease re-login.");
            alert("사용자 정보가 수정되었습니다.\n다시 로그인하세요.");
            Logout();
            window.location.replace(`/login`);
        }).catch((e) => {
            // alert("Failed to change information.\n" + e.response.statusText);
            alert("정보 수정에 실패했습니다.\n" + e.response.statusText);
            window.location.reload(); 
        })
    }

    if(_.isEmpty(user)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>UserData Not Found</b> </div>}
    else{
        return (
            <form onSubmit={changePW} className="div-box" style={{marginTop: "0", height:"20%"}}>
                <b> Edit My Information </b><br/>
                <input type={"text"} placeholder="New Nickname" onChange={inputNickname} value={newNickname} autoFocus></input><br/>
                <input type={"password"} placeholder="New Password" onChange={inputPassword} ></input><br/>
                <input type={"password"} placeholder="Check Password" onChange={checkNewPassword} ></input><br/>
                <input type={"text"} placeholder="New PhoneNumber (ex: 010-1234-1234)" onChange={inputPhone} value={newPhone} 
                       maxLength="13" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"></input><br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Change </button>
            </form>
        )
    }
}

export default MyInfoEditForm;