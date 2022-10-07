import { useState, useCallback } from "react";
import "../App.css"
import * as Function from "../func";

function MemberRegister(){
    const axios = require('axios');
    
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [name, setName] = useState("");

    const inputId = useCallback(e => {
        setId(e.target.value);
    }, [])

    const inputPassword = useCallback(e => {
        setPassword(e.target.value);
    }, [])
    
    const checkPassword = useCallback(e => {
        setPasswordCheck(e.target.value);
    }, [])
    
    const inputName = useCallback(e => {
        setName(e.target.value);
    }, [])


    const signUp = (e) => {
        e.preventDefault();

        if(Function.isEmpty(id)){
            alert("You must input your ID");
            return Error;
        }else{setId(id);}

        if(Function.isEmpty(password)){
            alert("You must input password");
            return Error;
        }else{setPassword(password);}
        
        if(Function.isEmpty(passwordCheck)){
            alert("You must check your password.");
            return Error;
        }else if(password!==passwordCheck){
            alert("Not matching password");
            return Error;
        }else {
            setPassword(password);
        }

        if(Function.isEmpty(name)){
            alert("You must input name!!!");
            return Error;
        }else{setName(name);}

        axios.post('/member', {
            data : {
                member_id : id,
                password : password,
                user_name : name
            }
        });
        
        alert("Register Success. \n Please Login.");
    }

    return (
        <div>
            <br/><br/>
            <form onSubmit={signUp}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Sign Up </b> <br/>
                    <input placeholder="ID" onChange={inputId}></input> <br/>
                    <input placeholder="Password" type="password" onChange={inputPassword}></input> <br/>
                    <input placeholder="Password Check" type="password" onChange={checkPassword}></input> <br/>
                    <input placeholder="Name" onChange={inputName}></input> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/`}}> register </button>
                </div>
            </form>
        </div>
    );
}

export default MemberRegister;