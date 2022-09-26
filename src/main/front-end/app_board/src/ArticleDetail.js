import React, {useState, useEffect} from "react";
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
    const urlList = ((window.location.href).split('/'));
    const article = urlList[(urlList.length)-1]

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
                <div style={{float: "right"}}>
                    <Link to={`/`} >
                            <button id="btn-default"> Home </button></Link>
                    <Link to={`/board`}>
                            <button id="btn-default"> List </button></Link>
                </div>
            </div>
            <div>
                <div id="div-align">
                    <b> Add Comment</b> <br/>
                    <input id="id-box" placeholder="User Id"></input> <br/>
                    <textarea id="text-box" placeholder="Add a comment"></textarea> 
                    <button id="btn-add"> Add </button>
                </div>
                <div>
                    <b>&lt;Comment List&gt;</b>
                    <div>{commentDataArr?.map((comment, index)=>{
                        return <CommentData data={comment} index={index} articleId={article}/>;
                    })}</div>
                </div>
            </div>
        </div>
    );
}


function CommentData({index, data, articleId}){

    const axios = require('axios');
    console.log(data);
    
    function deleteComment(articleId, commentId) { {
        axios.delete(`/board/${articleId}/${commentId}`)
            .then( console.log("DELETED" + data));
        };
        // return <CommentData data={data} index={index} articleId={articleId} />
    }

    // const [comment, setComment] = useState(data);
    // console.log(comment);

    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data.user_id} </span> <br/>
            <b> Content : </b> <span> {data.content} </span> <br/>
            <b> Created At : </b> <span> {data.created_at} </span>
            <br/>
            <b> Id : </b> <span> {data.id} </span>
            <b> Article Id : </b> <span> {data.article_id} </span>
            
            <button id="btn-remove" onClick={() => deleteComment(articleId, data.id)}>Delete</button>
            {console.log(data.id)}
        </li>
        <br/></>
    );
}


export default ArticleDeatil;