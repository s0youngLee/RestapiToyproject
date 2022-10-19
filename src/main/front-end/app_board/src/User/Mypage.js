import { useState } from "react";
import { split } from "lodash";
import { Link } from "react-router-dom";
import PasswordEditForm from "../Login/PasswordEditForm";
import { isAdmin } from "../func";
import MyArticles from "./MyArticles";
import MyComments from "./MyComments";

function MyPage({user}){
    const [visible, setVisible] = useState(false);
    const [visibleArticle, setVisibleArticle] = useState(false);
    const [visibleComment, setVisibleComment] = useState(false);

    if(!user) { return <div> Loading ... </div> }
    else {
        return (
            <div id="div-box">
                <h1>MY PAGE</h1><hr/>
                <div style={{textAlign: "left", border: "1px solid black", margin: "20px"}}>
                    <b> Name : </b><span> {user.name} </span><br/>
                    <b> Email : </b><span> {user.username} </span><br/>
                    <b> Nickname : </b><span> {user.nick_name} </span><br/>
                    <b> PhoneNumber : </b><span> {user.phone} </span><br/><br/>

                    <b> ROLE : </b><span> {split(user.auth, "_")[1]} </span><br/>
                    <button id="btn-post" style={{position: "absolute", top: "115px", right: "30px"}}
                            onClick={() => setVisible(!visible)}> {visible ? "Cancel" : "Change PW"} </button>
                    {visible && <PasswordEditForm user={user}/>}
                </div>
                <div>
                    <button id="btn-default" onClick={() => setVisibleArticle(!visibleArticle)}> My Articles </button>
                    {visibleArticle && <MyArticles />}
                </div>
                <div>
                    <button id="btn-default" onClick={() => setVisibleComment(!visibleComment)}> My Comments </button>
                    {visibleComment && <MyComments />}
                </div>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/board`} id="none"> <button id="btn-default"> Board </button></Link>
                {isAdmin(user?.auth) && 
                    <Link to={"/user/manage"} id="none"><button id="btn-remove">Manage users</button></Link>}
            </div>
        )
    }
}

export default MyPage;