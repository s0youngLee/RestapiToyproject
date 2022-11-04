import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";


function SignupForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useState("ROLE_USER");
    const [nickname, setNickName] = useState("");
    const [realName, setRealName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const inputEmail = useCallback(e => {
        setEmail(e.target.value);
    }, [])

    const inputPassword = useCallback(e => {
        setPassword(e.target.value);
    }, [])

    const inputNickName = useCallback(e => {
        setNickName(e.target.value);
    }, [])

    const inputRealName = useCallback(e => {
        setRealName(e.target.value);
    }, [])

    const inputPhoneNumber = useCallback(e => {
        setPhoneNumber(e.target.value);
    }, [])
    
    const setAdmin = useCallback(e => {
        setAuth("ROLE_ADMIN");
    }, [])

    const setUser = useCallback(e => {
        setAuth("ROLE_USER");
    }, [])


    const signUp = (e) => {
        e.preventDefault();
        axios.post('/user', {
            data : {
                email : email,
                password : password,
                auth : auth,
                nick_name : nickname,
                name : realName,
                phone : phoneNumber
            }
        }).then((res) => {
            alert("Register Successed.\nPlease login.");
            window.location.href="/login";
        }).catch((e) => {
            if(e.response.status === 451){
                if (window.confirm("Existing User ID.\nWanna login with this id?")){
                    window.location.href =  "/login";
                }else{
                    alert("Please register with other ID");
                }
            }else{
                alert("Error. Please try again.\n" + e.response);
                // window.location.replace("/login/signup");
            }
        });
    }

    return (
        <div className="div-box">
            <br/>
            <h2>Sign Up</h2> <hr/>

            <form onSubmit={signUp}>
                <input type="text" name="name" placeholder="name" onChange={inputRealName} required autoFocus/> <br/>
                <input type="text" name="email" placeholder="E-Mail ( ID )" onChange={inputEmail} required/> <br/>
                <input type="password" name="password" placeholder="Password" onChange={inputPassword} required/> <br/>
                <input type="text" name="nickname" placeholder="nickname" onChange={inputNickName} required/> <br/>
                <input type="text" maxLength={'11'} name="phone" placeholder="phone number" onChange={inputPhoneNumber}/> <br/>
                <p> ROLE : &nbsp;&nbsp;
                    <input type="radio" className="w3-radio" name="auth" value="ROLE_USER" defaultChecked="checked" onChange={setUser}/> User&nbsp;&nbsp;
                    <input type="radio" className="w3-radio" name="auth" value="ROLE_ADMIN" onChange={setAdmin}/> Admin<br/>
                </p>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal">Join</button>
                <Link className="none" to="/login">
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-deep-purple">Go to Login →</button>
                </Link>
            </form>

        </div>
    )
}

export default SignupForm;