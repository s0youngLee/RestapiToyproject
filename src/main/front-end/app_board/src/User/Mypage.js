import { useState, useMemo } from "react";
import PasswordEditForm from "../Login/PasswordEditForm";
import { isAdmin, FetchWithoutId } from "../func";
import MyArticles from "./MyArticles";
import MyComments from "./MyComments";
import UserManage from "./ManageUser";
import axios from "axios";

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

    let resource = useMemo(() => { return new Blob(); },[])
    function downloadExcel(dataName){
        axios.get(`/excel/download/${dataName}`, {responseType: "blob"})
        .then((res) => {
            resource = res.data;
            const downloadUrl = window.URL.createObjectURL(resource);            
            const fileName = res.headers['content-disposition'].split('=', -1)[1];
            const anchor = document.createElement('a');

            document.body.appendChild(anchor);
            anchor.download = fileName;
            anchor.href = downloadUrl;
            anchor.click();
    
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(downloadUrl);
        }).catch((e) => {
            console.log(e);
        })
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
                    {isAdmin(user?.auth) && <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                            onClick={() => downloadExcel("board")}> Download board </button>}
                    {isAdmin(user?.auth) && <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                            onClick={() => downloadExcel("user")}> Download Users </button>}
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" 
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