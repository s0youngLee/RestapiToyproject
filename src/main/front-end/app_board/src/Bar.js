import { Link } from "react-router-dom";
import { isLogin } from "./func";

function Bar() {
    return (
        <>
            <div style={{height: "80px", textAlign: "center", backgroundColor: "#aa9dff", position: "relative"}}>
                <b style={{color: "#373737", fontSize: "45px", verticalAlign: "middle"}}> Board </b> 
                <Link id="none" to={`/login`}>
                    <button id="btn-user" style={isLogin() ? {display : "none"} : {right: "10px"}}> Login </button>
                </Link>
                <form action="/userlogin?logout" method="post">
                    <button style={isLogin() ? {right: "10px"} : {display : "none"}} type="submit" id="btn-user"
                            onClick={() => sessionStorage.removeItem('username')} > Logout </button>
                </form>
                <Link id="none" to={`/mypage`}>
                    <button style={isLogin() ? {right: "120px"} : {display : "none"}} 
                            id="btn-user">My Page</button>
                </Link>
            </div>
        </>
    );
}

export default Bar;