// import React from "react";
import CommentRegister from "./CommentRegister";

function Comment({article}){
    const articleDetail = article;

    return (
        <div>
            <CommentRegister />
            <div>
                <b>&lt;Comment List&gt; : {articleDetail.comment.length} ea</b>
                <div>{articleDetail?.comment?.map((comment, index)=>{
                    return <CommentData key={index} data={comment}/>;
                })}</div>
            </div>
        </div>
    ) 
}


function CommentData({index, data}){

    const axios = require('axios');
    
    function deleteComment(articleId, commentId) {
        alert("Comment Deleted");
        axios.delete(`/comment/${commentId}`);
        window.location.href = `/board/${articleId}`;
    }

    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data?.user_id} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span>
            
            <button id="btn-remove" 
                    onClick={() => { deleteComment(data.article_id, data.id) }}>Delete</button>
        </li> <br/></>
    );
}

export default Comment;