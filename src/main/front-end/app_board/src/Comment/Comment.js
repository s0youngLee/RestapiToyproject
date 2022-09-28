import React, {useState, useEffect, useCallback} from "react";

function Comment(){
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
    
    
    const commentDataArr = articleDetail.data.comment;
    if(loading){ return <div> Loading ... </div> }
    else { return (
        <div>
            <CommentRegister />
            <div>
                <b>&lt;Comment List&gt;</b>
                <div>{commentDataArr?.map((comment, index)=>{
                    return <CommentData key={index} data={comment}/>;
                })}</div>
            </div>
        </div>
    ) }
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
            <b> User ID : </b> <span> {data?.user_id} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span>
            
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

    const axios = require('axios');

    const addUserId = useCallback(e => {
        setUserId(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const isEmpty = function(value){
        if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
            return true;
        }else { return false; }
    }

    const addComment = (e) => {
        if(isEmpty(userId)){ setUserId("unknown"); }
        
        if(isEmpty(content)){
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
                <button type="submit" id="btn-post"> Add </button>
            </div>
            <br/>
        </form>
    )
}

export default Comment;