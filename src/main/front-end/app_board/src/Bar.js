import { Link } from "react-router-dom";
import {useState} from "react";

function Bar() {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <div style={{height: "80px", textAlign: "center", backgroundColor: "#aa9dff", position: "relative"}}>
                <b style={{color: "#373737", fontSize: "45px", verticalAlign: "middle"}}> Board </b> 
                {/* 로그인 되어있으면 MyPage / Logout, 안되어있으면 Login 만 띄우도록 수정
                    현재는 클릭하면 Login/ Logout 이 번갈아 나오는 상태 */}
                <form action="/userlogin?logout" method="post">
                    <button style={{width: "100px", height: "50px" , position: "absolute", right: "10px", top: "10px"}} 
                            type="submit" id="btn-default" 
                            onClick={() => { 
                                setVisible(!visible);
                                sessionStorage.removeItem('username');    
                            }}>{ visible ? "Logout" : "Login" } </button>
                </form>
                <Link id="none" to={`/mypage/${sessionStorage.getItem('username')}`}>
                    <button style={{width: "100px", height: "50px" ,position: "absolute", right: "120px", top: "10px"}} 
                            id="btn-default">My Page</button>
                </Link>
            </div>
        </>
    );
}

export default Bar;