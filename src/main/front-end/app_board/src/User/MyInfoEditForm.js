import { useState, useCallback } from "react";
import _ from "lodash";
import axios from "axios";
import { autoHypenTel } from "../func";
import { Logout } from "../Bar";

function MyInfoEditForm({user}) {
    const [newNickname, setNewNickname] = useState();
    const [newPassword, setNewPassword] = useState();
    const [checkPassword, setCheckPassword] = useState();
    const [newPhone, setNewPhone] = useState();
    
    const inputNickname = useCallback(e => {
        setNewNickname(e.target.value);
    }, [])
    
    const inputPassword = useCallback(e => {
        setNewPassword(e.target.value);
        const check = document.getElementById("checkPassword");
        check.required = true;
        check.disabled = false;
    }, [])
    
    const checkNewPassword = useCallback(e => {
        if(!_.isEmpty(newPassword)){
            setCheckPassword(e.target.value);
        }else{
            e.target.disabled = true;
        }
    }, [newPassword])
    
    const inputPhone = useCallback(e => {
        setNewPhone(autoHypenTel(e.target.value));
    }, [])

    const changeInfo = (e) => {
        e.preventDefault();
        if(!_.isEmpty(checkPassword) && !_.isEqual(newPassword, checkPassword)){
            alert("비밀번호가 서로 맞지 않습니다.\n다시 확인해주세요.");
            return Error;
        }
        
        console.log(newPassword);
        console.log(newNickname);
        console.log(newPhone);
        
        axios.put(`/user`, {
            email : user.email,
            name : user.name,
            auth : user.auth,
            password : _.isEmpty(newPassword) ? "" : newPassword,
            nickName : _.isEmpty(newNickname) ? "" : newNickname,
            phone : _.isEmpty(newPhone) ? "" : newPhone
        }).then((res) => {
            alert("사용자 정보가 수정되었습니다.\n다시 로그인하세요.");
            Logout();
            window.location.replace(`/login`);
        }).catch((e) => {
            alert("정보 수정에 실패했습니다.\n" + e.response.statusText);
        })
    }

    const nicknameSelected = _.isEmpty(document.getElementById("newNickname")?.value);
    const passwordSelected = _.isEmpty(document.getElementById("newPassword")?.value);
    const phoneSelected = _.isEmpty(document.getElementById("newPhone")?.value);

    if(_.isEmpty(user)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>UserData Not Found</b> </div>}
    else{
        return (
            <form onSubmit={changeInfo} className="div-box" style={{marginTop: "0", height:"20%"}}>
                <b style={{fontSize: "20px"}}> 내 정보 변경 </b><br/>
                <div className="input-group">
                    <input type="text" name="newNickname" id="newNickname" className={nicknameSelected ? "input-default" : "input"}
                     value={newNickname} onChange={inputNickname} autoFocus/>
                    <label htmlFor="newNickname" className={nicknameSelected ? "input-label-default" : "input-label"}>
                        닉네임 변경</label>
                </div>
                <div className="input-group">
                    <input type="password" name="newPassword" id="newPassword" className={ passwordSelected ? "input-default" : "input"}
                         value={newPassword} onChange={inputPassword} />
                    <label htmlFor="newPassword" className={ passwordSelected ? "input-label-default" : "input-label"}>
                        비밀번호 변경</label>
                </div>
                <div className="input-group">
                    <input type="password" name="checkPassword" id="checkPassword" className={ passwordSelected ? "input-default" : "input"}
                     value={checkPassword} onChange={checkNewPassword} disabled/>
                    <label htmlFor="checkPassword"  className={ passwordSelected ? "input-label-default" : "input-label"}>
                        비밀번호 확인</label>
                </div>
                <div className="input-group">
                    {console.log(document.getElementById("newPhone")?.click())}
                    <input type="tel" name="newPhone" id="newPhone" className={ phoneSelected ? "input-default" : "input"} 
                     value={newPhone} onChange={inputPhone} 
                           maxLength="13" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"/>
                    <label htmlFor="newPhone"  className={ phoneSelected ? "input-label-default" : "input-label"}>
                        전화번호 변경</label>
                </div>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 변경사항 저장 </button>
            </form>
        )
    }
}

export default MyInfoEditForm;