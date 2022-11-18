import { useState, useMemo, useEffect } from "react";
import MyInfoEditForm from "../Login/MyInfoEditForm";
import { isAdmin, FetchWithoutId } from "../func";
import MyArticles from "./MyArticles";
import MyComments from "./MyComments";
import axios from "axios";
import _ from "lodash";

function MyPage(){
    const [visible, setVisible] = useState(false);
    const [visibleArticle, setVisibleArticle] = useState(true);
    const [visibleComment, setVisibleComment] = useState(false);
    
    let resource = useMemo(() => { return new Blob(); },[])
    
    const [user, setUser] = useState();
    const [articles, setArticles] = useState();
    const [comments, setComments] = useState();

    useEffect(() => {
        if(_.isEmpty(user)){
            axios.get("/user").then((res) => {
                setUser(res.data.data);
            }).catch((e) => {
                console.log(e);
            })
        }
        if(_.isEmpty(articles) && !_.isEqual(articles, [])){
            FetchWithoutId(articles, setArticles, "article/user");
        }
        if(_.isEmpty(comments) && !_.isEqual(comments, [])){
            FetchWithoutId(comments, setComments, "comment/user");
        }
    },[articles, comments, user]);

    function setClicked(){
        setVisibleArticle(false);
        setVisibleComment(false);
        setVisible(false);  
    }

    function downloadExcel(dataName){
        axios.get(`/${dataName}/excel/download`, {responseType: "blob"})
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
        }).catch((e) => {
            console.log(e);
        })
    }

    if(_.isEmpty(user)) { 
        return <div style={{marginTop: "100px", textAlign: "center"}}><b style={{fontSize: "30px"}}>User Not Found</b> </div> 
    }else {
        return (
            <div className="div-box" style={{marginLeft: "10px"}}>
                <b style={{ fontSize: "40px"}}>MY PAGE</b> <hr/>
                <div style={{textAlign: "left",padding: "10px", margin: "20px", marginBottom: 0}}>
                    <b> Name : </b><span> {user.name} </span><br/>
                    <b> Email : </b><span> {user.email} </span><br/>
                    <b> Nickname : </b><span> {user.nick_name} </span><br/>
                    <b> PhoneNumber : </b><span> {user.phone} </span><br/><br/>
                    {isAdmin() && 
                        <div>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => downloadExcel("article")}> Download board </button>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => downloadExcel("user")}> Download Users </button>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => window.location.href="/user/manage"}> Manage Users </button>
                        </div>
                    }                    
                </div><hr/>
                <div style={{width: "100%", height: "5.6vh", textAlign: "center", lineHeight : "5.6vh"}}>
                    <div className="page-bar" 
                        style={visibleArticle ? {backgroundColor: "mediumslateblue", color: "aliceblue"} : {}} 
                        onClick={() => {
                            setClicked();
                            setVisibleArticle(true);
                            }}> My Articles </div>
                    <div className="page-bar" 
                        style={visibleComment ? {backgroundColor: "mediumslateblue", color: "aliceblue"} : {}}
                        onClick={() => {
                            setClicked();
                            setVisibleComment(true);
                            }}> My Comments </div>
                    <div className="page-bar" 
                        style={visible ? {backgroundColor: "mediumslateblue", color: "aliceblue"} : {}}
                        onClick={() => {
                            setClicked();
                            setVisible(true);
                            }}> Change MyInfo </div>
                </div><hr/>
                {visibleArticle && <MyArticles articles={articles}/>}
                {visibleComment && <MyComments comments={comments}/>}
                {visible && <MyInfoEditForm user={user} />}
            </div>
        )
    }
}

export default MyPage;