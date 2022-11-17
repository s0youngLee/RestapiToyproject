import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function LoginForm(){
    sessionStorage.setItem("dateAlert", false);
    const [account, setAccount] = useState({
        username: "",
        password: "",
    });

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
        axios.post('/login', form)
        .then((res) => {
            // alert("Login successful.");
            alert("성공적으로 로그인되었습니다.\n 게시판 페이지로 이동합니다.");
            window.location.replace("/board");
        })
        .catch((err) => {
            if(err.response.status === 401){
                // alert("Insufficient ID or Password.\nPlease try again.");
                alert("아이디 또는 비밀번호가 틀렸습니다.\n 다시 시도하세요.");
            }else {
                alert(err + "\n로그인 실패.");
                window.location.reload();
            }
        })
    }

    return (
    <div className="div-box">
        <br/>
        <form >
            <h2 >Please Login</h2> <hr/>
            <input type="text" id="username" name="username" placeholder="ID (Email)" onChange={onChangeAccount} required autoFocus/><br/>
            <input type="password" id="password" name="password" placeholder="Password" onChange={onChangeAccount} required/><br/>
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" type="submit" 
                    onClick={userlogin} >Login</button>
            <Link className="none" to="/login/signup">
                <button className="w3-button w3-round-xlarge w3-small w3-hover-deep-purple w3-border">Register</button>
            </Link>
        </form> 
    </div>
    )
}

export default LoginForm;