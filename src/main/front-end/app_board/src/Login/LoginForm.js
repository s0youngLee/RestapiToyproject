import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { ifError } from "../func";

function LoginForm(){
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
        axios.post('/userlogin', form)
        .then((res) => {
            if(res.status===200){
                sessionStorage.setItem("isLogin", true);
                alert("Login successful.\nMove to board.");
                window.location.replace("/board");
            }else {
                ifError(res);
            }
        })
        .catch((err) => {
            if(err.response.withCredentials===false){
                alert("Insufficient ID or Password.\nPlease try again.");
            }else{
                alert(err + "\nFailed to login. Try again.");
            }
            window.location.reload();
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
                <button className="w3-button w3-round-xlarge w3-small w3-hover-deep-purple w3-border">Sign up</button>
            </Link>
        </form> 
    </div>
    )
}

export default LoginForm;