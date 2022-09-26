import axios from "axios";
import React, {useState, useEffect, useCallback} from "react";
import {Link} from 'react-router-dom';


function ArticleDeatil(){
    const urlList = ((window.location.href).split('/'));
    const articleId = urlList[(urlList.length)-1]

    const [articleDetail, setArticleDetail] = useState({
        data : {}
    });

    useEffect(()=> {
        const RES = fetch(`/board/${articleId}`)
                    .then(res =>  res.json())
                    .then(result => setArticleDetail(result));
    },[]);

    return (
        <div>
            <ArticleDetailData key={articleId} data={articleDetail.data} />
        </div>
    )
}

function ArticleDetailData({articleId, data}) {
    const commentDataArr = data.comment;

    const axios = require('axios');
    
    function deleteArticle(articleId) {
        alert("Do you want to delete this article?");
        axios.delete(`/board/${articleId}`);
        window.location.href = `/board`;
    }

    return (
        <div style={{marginLeft: "10px"}} key={articleId}>
            <h1>Article Detail</h1> <br/>
            <div style={{borderBottom: "2.5px solid black", padding: "10px"}}>
                <b> ID : </b> <span> {data?.id} </span> <br/>
                <b> Title : </b> <span> {data?.title} </span> <br/>
                <b> Category : </b> <span> {data?.category_name} </span> <br/>
                <b> Content : </b> <span> {data?.content} </span> <br/>
                <b> Created By : </b> <span> {data?.created_id} </span> <br/>
                <b> Created At : </b> <span> {data?.created_at} </span> <br/>
                <b> Visit : </b> <span> {data?.visit_cnt} </span> 
                <button id="btn-remove" 
                onClick={() => { deleteArticle(data.id) }}>Delete</button>
                <div style={{float: "right"}}>
                    <Link to={`/`} >
                            <button id="btn-default"> Home </button></Link>
                    <Link to={`/board`}>
                            <button id="btn-default"> List </button></Link>
                </div>
            </div>
            <div>
                <CommentRegister />
                <div>
                    <b>&lt;Comment List&gt;</b>
                    <div>{commentDataArr?.map((comment, index)=>{
                        return <CommentData data={comment} index={index}/>;
                    })}</div>
                </div>
            </div>
        </div>
    );
}


function CommentData({index, data}){

    const axios = require('axios');
    
    function deleteComment(articleId, commentId) {
        alert("Do you want to delete this comment?");
        axios.delete(`/board/${articleId}/${commentId}`);
        window.location.href = `/board/${articleId}`;
    }

    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data.user_id} </span> <br/>
            <b> Content : </b> <span> {data.content} </span> <br/>
            <b> Created At : </b> <span> {data.created_at} </span>
            
            <button id="btn-remove" 
                    onClick={() => { deleteComment(data.article_id, data.id) }}>Delete</button>
        </li> <br/></>
    );
}


function CommentRegister(){
    const urlList = ((window.location.href).split('/'));
    const articleId = urlList[(urlList.length)-1]
    
    const [userId, setUserId] = useState("unknown");
    const [content, setContent] = useState("");

    const addUserId = useCallback(e => {
        setUserId(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const addComment = (e) => {
        if(e.target.value !== (null || "")){
            setUserId(userId);
        }
        
        if(content === (null || "")){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post(`/board/${articleId}`, {
            data: {
                user_id: userId,
                content: content
            }
            });
        
        alert("comment registerd");
    }

    return(
        <form onSubmit={addComment}>
            <div id="div-align">
                <b> Add Comment</b> <br/>
                <input id="id-box" placeholder="User Id"
                       onChange={addUserId}></input> <br/>
                <textarea id="text-box" placeholder="Add a comment"
                          onChange={addContent}></textarea> 
                <button type="submit" id="btn-add"> Add </button>
            </div>
        </form>
    )
}


export default ArticleDeatil;