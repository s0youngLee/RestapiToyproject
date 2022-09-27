import axios from "axios";
import React, {useState, useEffect, useCallback} from "react";
import {Link, useNavigate} from 'react-router-dom';


function ArticleDeatil(){
    const urlList = ((window.location.href).split('/'));
    const articleId = urlList[(urlList.length)-1];
    
    const [articleDetail, setArticleDetail] = useState({
        data : {}
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(()=> {
        const RES = fetch(`/board/${articleId}`)
        .then(res =>  res.json())
        .then(result => {
            setArticleDetail(result);
            setLoading(false);
        });
    },[]);
    
    if(loading){ return <div> Loading ... </div> }
    else { return (
        <ArticleDetailData data={articleDetail.data} />
    ) }
}

function ArticleDetailData({data}) {
    const commentDataArr = data.comment;
    const navi = useNavigate();
    
    const axios = require('axios');

    function deleteArticle(articleId) {
        alert("Aritcle Deleted");
        axios.delete(`/board/${articleId}`);
        navi(-1);
    }
    
    return (
        <div style={{marginLeft: "10px"}}>
            <div style={{borderBottom: "2.5px solid black", padding: "10px", overflow: "auto"}}>
                <div style={{float: "left", width: "500px", marginRight: "20px"}}>
                    <h1>Article Detail</h1> <br/>
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
                        <Link to={`/`} id="none">
                                <button id="btn-default"> Home </button></Link>
                        <Link to={`/board`} id="none">
                                <button id="btn-default"> Article List </button></Link>
                        <Link to={`/category/board/${data?.category_id}`} id="none">
                            <button id="btn-default"> {data?.category_name} List </button></Link>
                    </div>
                </div>
                <ArticleEditForm titleOrigin={data?.title} contentOrigin={data?.content} categoryOrigin={data?.category_id} idOrigin={data?.created_id} articleId={data?.id}/>
            </div>
            <div>
                <CommentRegister />
                <div>
                    <b>&lt;Comment List&gt;</b>
                    <div>{commentDataArr?.map((comment, index)=>{
                        return <CommentData key={index} data={comment}/>;
                    })}</div>
                </div>
            </div>
        </div>
    );
}

function CommentData({index, data}){

    const axios = require('axios');
    
    function deleteComment(articleId, commentId) {
        alert("Comment Deleted");
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
function ArticleEditForm({titleOrigin, contentOrigin, categoryOrigin, idOrigin, articleId}) {
    const axios = require('axios');

    const [title, setTitle] = useState(titleOrigin);
    const [content, setContent] = useState(contentOrigin);
    const [category, setCategory] = useState(categoryOrigin);
    const [createdId, setCreatedId] = useState(idOrigin);

    const editCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const editTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const editCategory = useCallback(e => {
        setCategory(e.target.value);
    }, [])
    
    const editContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const isEmpty = function(value){
        if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
            return true;
        }else { return false; }
    }

    const editArticle = (e) => {
        if(isEmpty(e.target.value)){ setCreatedId(idOrigin); }
        if(isEmpty(e.target.value)){ setTitle(titleOrigin); }
        if(isEmpty(e.target.value)){ setTitle(categoryOrigin); } 
        if(isEmpty(e.target.value)){ setContent(contentOrigin); }
        
        axios.put(`/board/${articleId}`, {
            data : {
                title : title,
                content : content,
                created_id : createdId,
                category_id : category
            }
        });
        
        alert("Article Edited");
    }

    return(
        <div style={{float: "left"}}>
            <form onSubmit={editArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Editing Article </b> <br/>
                    <input id="id-box" placeholder="Creator Id" onChange={editCreatedId}></input> <br/>
                    <input id="id-box" placeholder="Title" onChange={editTitle}></input> <br/>
                    <input id="id-box" placeholder="Category" onChange={editCategory} ></input> <br/>
                    <textarea id="text-box" placeholder="Content" onChange={editContent}></textarea> <br/>
                    <button type="submit" id="btn-add" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board/${articleId}`}}> Save </button>
                </div>
            </form>
        </div>
    )
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
            <br/>
        </form>
    )
}


export default ArticleDeatil;