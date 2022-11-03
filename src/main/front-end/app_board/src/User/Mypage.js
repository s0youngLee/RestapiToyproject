import { useState } from "react";
import PasswordEditForm from "../Login/PasswordEditForm";
import { isAdmin, FetchWithoutId } from "../func";
import MyArticles from "./MyArticles";
import MyComments from "./MyComments";
import UserManage from "./ManageUser";

function MyPage({user}){
    const articles = Array.from(FetchWithoutId("board/user"));
    const comments = Array.from(FetchWithoutId("comment/user"));
    const manage = Array.from(FetchWithoutId("user/manage").data);

    const [visible, setVisible] = useState(false);
    
    const [visibleArticle, setVisibleArticle] = useState(true);
    const [visibleComment, setVisibleComment] = useState(false);
    const [visibleUser, setVisibleUser] = useState(false);

    function setClicked(){
        setVisibleArticle(false);
        setVisibleComment(false);
        setVisibleUser(false);    
    }

    if(!user) { return <div> Loading ... </div> }
    else {
        return (
            <div className="div-box">
                <b style={{ fontSize: "40px"}}>MY PAGE</b> <hr/>
                <div style={{textAlign: "left",padding: "10px", margin: "20px", marginBottom: 0}}>
                    <b> Name : </b><span> {user.name} </span><br/>
                    <b> Email : </b><span> {user.email} </span><br/>
                    <b> Nickname : </b><span> {user.nick_name} </span><br/>
                    <b> PhoneNumber : </b><span> {user.phone} </span><br/><br/>
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" 
                            style={{position: "absolute", top: "115px", right: "30px"}}
                            onClick={() => setVisible(!visible)}> {visible ? "Cancel" : "Change PW"} </button>
                    {visible && <PasswordEditForm user={user}/>}
                </div><hr/>
                <div style={{width: "100%", height: "5.6vh", textAlign: "center", lineHeight : "5.6vh"}}>
                    <div className="page-bar" 
                        style={visibleArticle ? {backgroundColor: "mediumslateblue", color: "aliceblue", fontSize: "20px"} : {}} 
                        onClick={() => {
                            setClicked();
                            setVisibleArticle(true);
                            }}> My Articles </div>
                    <div className="page-bar" 
                        style={visibleComment ? {backgroundColor: "mediumslateblue", color: "aliceblue", fontSize: "20px"} : {}}
                        onClick={() => {
                            setClicked();
                            setVisibleComment(true);
                            }}> My Comments </div>
                    {isAdmin(user?.auth) && 
                    <div className="page-bar" 
                        style={visibleUser ? {backgroundColor: "mediumslateblue", color: "aliceblue", fontSize: "20px"} : {}}
                        onClick={() => {
                            setClicked();
                            setVisibleUser(true);
                            }}> Manage Users </div>}
                </div><hr/>
                {visibleArticle && <MyArticles articles={articles}/>}
                {visibleComment && <MyComments comments={comments}/>}
                {visibleUser && <UserManage manage={manage}/>}
            </div>
        )
    }
}

export default MyPage;