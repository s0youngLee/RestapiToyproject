import "../App.css";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

function LoginForm(){

    const [id, setId] = useState("");
    const [pw, setPW] = useState("");

    const [msg, setMsg] = useState("");

    useEffect(()=> {
        if(msg) {
            setTimeout(() => {
                setMsg("");
                // setLoading(false);
            }, 1500);
        }
    }, [msg])

    const inputId = useCallback(e => {
        setId(e.target.value);
    }, [])
    const inputPw = useCallback(e => {
        setPW(e.target.value);
    }, [])

    function login(e) {
        if (!id) {
            return alert("Input Id");
        } else {
            setId(e.target.value);
        }

        if (!pw) {
            return alert("Input PW");
        } else {
            setPW(e.target.value);
        }
        
        axios.post("/login", {
                    data: {
                        id: id,
                        password: pw
                    }
                }).then((res) => {
                console.log(res.data);
                switch (res.data.code) {
                    case 200:
                        console.log("login");
                        console.log(res.data.userInfo);
                        setMsg("");
                        break;
                    case 400:
                        setMsg("ID, PW is Empty");
                        break;
                    case 401:
                        setMsg("Not existing ID");
                        break;
                    case 402:
                        setMsg("Wrong Password");
                        break;
                    default:
                        break;
                }
            });
    }

    return (
        <div>
            <br/><br/>
            <form onSubmit={login}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Login Page </b> <br/>
                    <input placeholder="ID" onChange={inputId}></input> <br/>
                    <input type="password" placeholder="Password" onChange={inputPw}></input> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/`}}> Login </button>
                    <Link id="none" to="/"><button id="btn-default"> Home </button></Link>
                </div>
            </form>
            <div style={{textAlign: "center"}}>
                <b> Don't have id ? </b>
                <Link id="none" to="/member/signup"><button id="btn-default"> Sign up </button></Link>
            </div>
        </div>
    )
}

export default LoginForm;