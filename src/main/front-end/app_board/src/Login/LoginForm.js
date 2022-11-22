import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import "../App.css";

function LoginForm(){
    sessionStorage.setItem("dateAlert", false);
    const remember = document.getElementsByName('remember-me');
    const [account, setAccount] = useState({
        username: "",
        password: "",
    });


    console.log(remember);
    const onChangeAccount = (e) => {
        setAccount({
        ...account,
        [e.target.name]: e.target.value,
        });
    };

    let form = new FormData();
        form.append('username', account.username);
        form.append('password', account.password);

    const userlogin = (e) => {
        e.preventDefault();
        if(remember[0].checked){
            form.append('remember-me', remember[0].checked);
            console.log("appended");
        }
        console.log(remember[0].checked);
        axios.post('/login', form)
        .then((res) => {
            alert("성공적으로 로그인되었습니다.");
            sessionStorage.setItem("login", true);
            axios.get("/user").then((res) => {
                const encode = Buffer.from(res.data.nick_name + "/"
                                            + res.data.auth + "/"
                                            + res.data.code + "/"
                                            + res.data.last_access ).toString('base64');
                sessionStorage.setItem("userinfo", encode);
            }).catch((e) => {
                console.log(e);
            })
            if(_.isEqual(res.headers.lastlogin, "true")){
                if(window.confirm("비밀번호 변경을 추천합니다.\n확인을 누르면 마이페이지로 이동합니다.")){
                    sessionStorage.setItem("dateAlert", true);
                    window.location.replace("/mypage");
                }else{
                    alert("게시판 페이지로 이동합니다.");
                    sessionStorage.setItem("dateAlert", true);
                    window.location.replace("/board");
                }
            }else{
                alert("게시판 페이지로 이동합니다.");
                sessionStorage.setItem("dateAlert", true);
                window.location.href = "/board";
            }
        })
        .catch((err) => {
            sessionStorage.setItem("login", false);
            if(err.response.status === 401){
                alert("잘못된 비밀번호입니다.\n다시 시도하세요.");
            }else if(err.response.status === 404){
                alert("존재하지 않는 아이디입니다.");
            }else {
                alert(err + "\n로그인 실패.");
                window.location.reload();
            }
        })
    }

    return (
    <div className="div-box" style={{marginLeft: "10px"}}>
        <br/>
        <form >
            <h2 > App_Board </h2> <hr/>
            <p style={{marginBottom : "0"}}>
                <input type="text" id="username" name="username" placeholder="ID (Email)" onChange={onChangeAccount} required autoFocus/>
            </p>
            <p style={{marginBottom : "0"}}>
                <input type="password" id="password" name="password" placeholder="Password" onChange={onChangeAccount} required/><br/>
            </p>
            <p>
                <input type={'checkbox'} name='remember-me'/> &nbsp;자동 로그인
            </p>
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" type="submit" 
                    onClick={userlogin} >로그인</button>
            <Link className="none" to="/login/signup">
                <button className="w3-button w3-round-xlarge w3-small w3-hover-deep-purple w3-border">회원가입</button>
            </Link>
        </form> 
    </div>
    )
}

export default LoginForm;