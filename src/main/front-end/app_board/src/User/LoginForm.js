import { Link } from "react-router-dom";
import "../App.css";

function LoginForm(){
    function userLogin() {
        sessionStorage.setItem('username', document.getElementById("username").value);
        alert(sessionStorage.getItem('username'));
    }

    return (
        <div id="div-box">
        <br/>
        <form action="/userlogin" method="post" onSubmit={userLogin}>
            <h2 >Please Login</h2> <hr/>
            <input type="text" id="username" name="username" placeholder="ID (Email)" required autoFocus/><br/>
            <input type="password" id="password" name="password" placeholder="Password" required/><br/>
            <button id="btn-post" type="submit">Login</button>
            <Link to="/login/signup"><button id="btn-default" type="submit">Sign up</button></Link>
        </form> 
        <Link id="none" to="/"><button id="btn-default">Home</button></Link>
    </div>
    )
}

export default LoginForm;