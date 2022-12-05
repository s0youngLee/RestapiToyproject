import axios from "axios";
import { useState } from "react";
import _ from "lodash";
import "../App.css";
import { useCookies } from "react-cookie";

function LoginForm(){
    const [cookies, ,] = useCookies();
    const remember = document.getElementsByName('remember-me');
    const [account, setAccount] = useState({
        username: "",
        password: ""
    });

    const onChangeAccount = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value
        });
    };
    
    let form = new FormData();
        form.append('username', account.username);
        form.append('password', account.password);

    const userlogin = (e) => {
        e.preventDefault();
        if(remember[0].checked){
            form.append('remember-me', remember[0].checked);
        }
        if(_.isEmpty(account.username) || _.isEmpty(account.password)){
            alert("입력란을 채워주세요");
            return Error;
        }
        
        axios.post('/login', form)
        .then((res) => {
            alert("성공적으로 로그인되었습니다.");
            if(remember[0].checked){
                localStorage.setItem("userinfo", cookies.user);
                localStorage.setItem("dateAlert", "true");
            }else{
                sessionStorage.setItem("userinfo", cookies.user);
                localStorage.setItem("dateAlert", "false");
            }
            alert("게시판 페이지로 이동합니다.");
            window.location.href = "/board";
        })
        .catch((err) => {
            if(err.response.status === 401){
                alert("잘못된 비밀번호입니다.\n다시 시도하세요.");
            }else if(err.response.status === 404){
                alert("존재하지 않는 아이디입니다.");
            }else {
                alert(err + "\n로그인 실패.");
            }
        })
    }
    
    const usernameSelected = _.isEmpty(document.getElementById("username")?.value);
    const passwordSelected = _.isEmpty(document.getElementById("password")?.value);

    return (
    <div className="div-box" style={{marginLeft: "10px"}}>
        <br/>
        <form >
            <h2 > App_Board </h2> <hr/>
            <div className="input-group">
                <input type="text" id="username" name="username" className={ usernameSelected ? "input-default" : "input"}
                        onChange={onChangeAccount} required autoFocus/>
                <label htmlFor="username" className={ usernameSelected ? "input-label-default" : "input-label"}>
                    ID(Email)</label>
            </div>
            <div className="input-group">
                <input type="password" id="password" name="password" className={ passwordSelected ? "input-default" : "input"}
                       onChange={onChangeAccount} required/>
                <label htmlFor="password" className={ passwordSelected ? "input-label-default" : "input-label"}>
                    Password</label>
            </div>
            <p>
                <input type={'checkbox'} name='remember-me'/> &nbsp;자동 로그인
            </p>
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" type="submit" 
                    onClick={userlogin} >로그인</button>
            <button className="w3-button w3-round-xlarge w3-small w3-hover-deep-purple w3-border"
                    onClick={() => window.location.href="/login/signup"}>회원 가입</button>
        </form> 
    </div>
    )
}

export default LoginForm;