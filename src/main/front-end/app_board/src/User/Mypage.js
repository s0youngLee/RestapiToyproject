import { split } from "lodash";
import { Link } from "react-router-dom";
import { Fetching, username } from "../func";

function MyPage(){
    const user = Fetching("user", username());

    if(!user) { return <div> Loading ... </div> }
    else {
        return (
            <div id="div-box">
                <h1>MY PAGE</h1><hr/>
                <div style={{textAlign: "left", border: "1px solid black", margin: "20px"}}>
                    <b> User Code : </b><span> {user.code} </span><br/>
                    <b> User Name : </b><span> {user.username} </span><br/>
                    <b> PassWord : </b><span> {user.password} </span><br/>
                    <b> ROLE : </b><span> {split(user?.authorities[0]?.authority, "_")[1]} </span><br/>
                </div>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/board`} id="none"> <button id="btn-default"> Board </button></Link>
            </div>
        )
    }
}

export default MyPage;