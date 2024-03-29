import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { autoHypenTel } from "../func";
import _ from "lodash";


function SignupForm(){
    const [auth, setAuth] = useState("ROLE_USER");
    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        nickname: "",
        realName: "",
        phoneNumber: ""
    });

    const onChangeData = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: [_.isEqual(e.target.name, "phoneNumber") ? autoHypenTel(e.target.value) : e.target.value]
        });
    };

    const setAdmin = useCallback(e => {
        setAuth("ROLE_ADMIN");
    }, [])

    const setUser = useCallback(e => {
        setAuth("ROLE_USER");
    }, [])


    const signUp = (e) => {
        e.preventDefault();
        axios.post('/user', {
            email: registerData.email[0],
            password: registerData.password[0],
            name: registerData.realName[0],
            nick_name: registerData.nickname[0],
            phone: registerData.phoneNumber[0],
            auth: auth
        }
        ).then((res) => {
            alert("회원가입이 완료되었습니다.\n로그인 페이지로 이동합니다.");
            window.location.href="/login";
        }).catch((e) => {
            if(e.response.status === 409){
                if (window.confirm("이미 존재하는 아이디입니다.\n이 아이디로 로그인하시겠습니까?")){
                    window.location.href =  "/login";
                }else{
                    alert("다른 아이디로 가입해주세요.");
                }
            }else{
                alert("Error. 다시 시도해주세요.\n" + e.response);
            }
        });
    }

    const nameSelected = _.isEmpty(document.getElementById("name")?.value);
    const emailSelected = _.isEmpty(document.getElementById("email")?.value);
    const passwordSelected = _.isEmpty(document.getElementById("passwordregi")?.value);
    const nicknameSelected = _.isEmpty(document.getElementById("nickname")?.value);
    const phoneSelected = _.isEmpty(document.getElementById("phone")?.value);

    return (
        <div className="div-box">
            <br/>
            <h2>Sign Up</h2> <hr/>

            <form onSubmit={signUp}>
                <div className="input-group">
                    <input type="text" name="realName" id="name" className={ nameSelected ? "input-default" : "input"}
                           onChange={onChangeData} required autoFocus/> 
                    <label htmlFor="name" className={ nameSelected ? "input-label-default" : "input-label"}>
                        Name</label>
                </div>
                <div className="input-group">
                    <input type="text" name="email" id="email" className={ emailSelected ? "input-default" : "input"}
                            onChange={onChangeData} required/>
                    <label htmlFor="email" className={ emailSelected ? "input-label-default" : "input-label"}>
                        ID(E-mail)</label>
                </div>
                <div className="input-group">
                    <input type="password" name="password" id="passwordregi" className={ passwordSelected ? "input-default" : "input"}
                             onChange={onChangeData} required/>
                    <label htmlFor="password" className={ passwordSelected ? "input-label-default" : "input-label"}>
                        Password</label>
                </div>
                <div className="input-group">
                    <input type="text" name="nickname" id="nickname" className={ nicknameSelected ? "input-default" : "input"}
                             onChange={onChangeData} required/>
                    <label htmlFor="nickname" className={ nicknameSelected ? "input-label-default" : "input-label"}>
                        Nickname</label>
                </div>
                <div className="input-group">
                    <input type="tel" name="phoneNumber" id="phone" className={ phoneSelected ? "input-default" : "input"}
                        onChange={onChangeData} value={registerData.phoneNumber}  maxLength="13" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"></input>
                    <label htmlFor="phone" className={ phoneSelected ? "input-label-default" : "input-label"}>
                        PhoneNumber</label>
                </div>
                <p> 권한 : &nbsp;&nbsp;
                    <input type="radio" className="w3-radio" name="auth" value="ROLE_USER" defaultChecked="checked" onChange={setUser}/> 사용자&nbsp;&nbsp;
                    <input type="radio" className="w3-radio" name="auth" value="ROLE_ADMIN" onChange={setAdmin}/> 관리자<br/>
                </p>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal">가입</button>
                <Link className="none" to="/login">
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-deep-purple">로그인 페이지</button>
                </Link>
            </form>

        </div>
    )
}

export default SignupForm;