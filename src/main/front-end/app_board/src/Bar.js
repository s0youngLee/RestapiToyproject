import { Link } from "react-router-dom";

function Bar() {
    return (
        <>
            <div style={{height: "80px", textAlign: "center", backgroundColor: "#aa9dff"}}>
                <b style={{color: "#373737", fontSize: "45px", verticalAlign: "middle"}}> Board </b> 
            </div>
            {/* 아래 sign in 버튼은 로그인 되어있으면 sign out, 안되어있으면 sign in으로 띄우도록 수정하기 / signout 일 경우 로그아웃 호출 */}
            <Link id="none" to="/"> 
                <button id="btn-default" style={{float: "right", width: "100px", height: "40px"}}> Sign In </button>
            </Link>
        </>
    );
}

export default Bar;