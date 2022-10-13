import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as Function from "../func";
import axios from "axios";
import "../App.css";


function SignupForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useState("ROLE_USER");

    const inputEmail = useCallback(e => {
        setEmail(e.target.value);
    }, [])

    const inputPassword = useCallback(e => {
        setPassword(e.target.value);
    }, [])
    
    const setAdmin = useCallback(e => {
        setAuth("ROLE_ADMIN");
    }, [])

    const setUser = useCallback(e => {
        setAuth("ROLE_USER");
    }, [])


    const signUp = (e) => {
        if(Function.isEmpty(email)){
            alert("You must input your Email");
            return Error;
        }else{setEmail(email);}

        if(Function.isEmpty(password)){
            alert("You must input password");
            return Error;
        }else{setPassword(password);}

        let userData = {
            data : {
                email : email,
                password : password,
                auth : auth
            }
        }

        axios.post('/user', JSON.stringify(userData), {
            headers: {
                "Content-Type": `application/json`
            }
        }).then(() => {
            alert("Register Successed.\nPlease login.");
            window.location.href("/login");
        }).catch((e) => {
            alert("Error. Please try again.\n" + e.response);
            window.location.replace("/login/signup");
        });
    }

    return (
        <div id="div-box">
            <br/>
            <h2>Sign Up</h2> <hr/>

            <form onSubmit={signUp}>
                <input type="text" name="email" placeholder="E-Mail" onChange={inputEmail}/> <br/>
                <input type="password" name="password" placeholder="Password" onChange={inputPassword}/> <br/>
                <p> ROLE : 
                    <input type="radio" name="auth" value="ROLE_ADMIN" style={{"width": "30px"}} onChange={setAdmin}/> ADMIN ||
                    <input type="radio" name="auth" value="ROLE_USER" defaultChecked="checked" style={{"width": "30px"}} onChange={setUser}/> USER <br/>
                </p>
                <button type="submit" id="btn-post" onClick={signUp}>Join</button>
            </form>

            <Link id="none" to="/login"><button id="btn-default">Go to Login →</button></Link>
        </div>
    )
}

export default SignupForm;