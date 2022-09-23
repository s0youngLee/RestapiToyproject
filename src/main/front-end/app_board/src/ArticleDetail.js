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

    return (
        <div id="liNone" key={articleId}>
            <h1>Article Detail</h1> <br/>
            <div>
                <b> ID : </b> <span> {data?.id} </span> <br/>
                <b> Title : </b> <span> {data?.title} </span> <br/>
                <b> Category : </b> <span> {data?.category_name} </span> <br/>
                <b> Content : </b> <span> {data?.content} </span> <br/>
                <b> Created By : </b> <span> {data?.created_id} </span> <br/>
                <b> Created At : </b> <span> {data?.created_at} </span> <br/>
                <b> Visit : </b> <span> {data?.visit_cnt} </span> <br/>
                <nav>
                    <Link to={`/`}>
                        <button id="btn-detail"> Home </button></Link>
                    <Link to={`/board`}>
                        <button id="btn-detail"> List </button></Link>
                </nav>
            </div>
            <div id="liNone">
                <ul id="ulNone"> 
                    <b> Add Comment</b>
                    <div id="div-align">
                        <textarea id="add" placeholder="Add a comment"></textarea> <button id="btn-detail"> Add </button> <br/>
                    </div>
                    <div>
                        <b>&lt;Comment List&gt;</b>
                        <div>{commentDataArr?.map((comment, index)=>{
                            return <CommentData data={comment} index={index} />;
                        })}</div>
                    </div>
                </ul>    
            </div>
        </div>
    );
}

function CommentData({index, data}){

    removeComment = (id) => {
        return setComments(comments.filter((comment) => comment.id !== id));
    }

    return(
        <><li id="liNone" key={index}>
            <b> User ID : </b> <span> {data.user_id} </span> <br/>
            <b> Content : </b> <span> {data.content} </span> <br/>
            <b> Created At : </b> <span> {data.created_at} </span> <br/>
            <button id="btn-remove" onClick={removeComment(data.id)}>Delete</button>
        </li>
        <br/></>
    );
}


export default ArticleDeatil;