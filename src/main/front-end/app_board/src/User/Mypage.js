import { useState, useMemo, useEffect } from "react";
import MyInfoEditForm from "./MyInfoEditForm";
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
    const [articlesData, setArticlesData] = useState();
    const [commentsData, setCommentsData] = useState();

    useEffect(() => {
        if(_.isEmpty(user)){
            axios.get("/user/info").then((res) => {
                setUser(res.data);
            }).catch((e) => {
                console.log(e);
            })
        }
        if(_.isEmpty(articlesData) && !_.isEqual(articlesData, [])){
            FetchWithoutId(articlesData, setArticlesData, "article/user");
        }
        if(_.isEmpty(commentsData) && !_.isEqual(commentsData, [])){
            FetchWithoutId(commentsData, setCommentsData, "comment/user");
        }
    },[articlesData, commentsData, user]);

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
                <b style={{ fontSize: "40px"}}>내 정보</b>
                <div style={{textAlign: "left", padding: "20px", margin: "10px", marginBottom: 0, backgroundColor: "#f3f3f3"}}>
                    <b> 이름 : </b><span> {user.name} </span><br/>
                    <b> 아이디 : </b><span> {user.email} </span><br/>
                    <b> 닉네임 : </b><span> {user.nick_name} </span><br/>
                    <b> 전화번호 : </b><span> {user.phone} </span><br/><br/>
                    {isAdmin() && 
                        <div>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => downloadExcel("article")}> 전체 게시물 다운로드 </button>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => downloadExcel("user")}> 전체 사용자 다운로드 </button>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => window.location.href="/user/manage"}> 사용자 권한 관리 </button>
                            {/* <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => window.location.href="/article/manage"}> Manage Articles </button> */}
                        </div>
                    }                    
                </div><hr/>
                <div style={{width: "100%", height: "5.6vh", textAlign: "center", lineHeight : "5.6vh"}}>
                    <div className="page-bar" 
                        style={visibleArticle ? {backgroundColor: "mediumslateblue", color: "aliceblue"} : {}} 
                        onClick={() => {
                            setClicked();
                            setVisibleArticle(true);
                            }}> 내 게시물 </div>
                    <div className="page-bar" 
                        style={visibleComment ? {backgroundColor: "mediumslateblue", color: "aliceblue"} : {}}
                        onClick={() => {
                            setClicked();
                            setVisibleComment(true);
                            }}> 내 댓글 </div>
                    <div className="page-bar" 
                        style={visible ? {backgroundColor: "mediumslateblue", color: "aliceblue"} : {}}
                        onClick={() => {
                            setClicked();
                            setVisible(true);
                            }}> 정보 수정 </div>
                </div><hr/>
                {visibleArticle && <MyArticles articles={articlesData}/>}
                {visibleComment && <MyComments comments={commentsData}/>}
                {visible && <MyInfoEditForm user={user} />}
            </div>
        )
    }
}

export default MyPage;