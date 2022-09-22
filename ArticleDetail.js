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
            .then(result => setArticleDetail(articleDetail.data = result));
    },[]);
    
    return (
        <div>
            <ArticleDetailData key={articleId} data={articleDetail.data} />
        </div>
    )
}

function ArticleDetailData({articleId, data}) {
    
    const commentDataArr = data?.comment;

    return (
        <div id="liNone" key={articleId}>
            <h1>Article Detail</h1> <br/>
            <b> ID : </b> <span> {data?.id} </span> <br/>
            <b> Title : </b> <span> {data?.title} </span> <br/>
            <b> Category : </b> <span> {data?.category_name} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created By : </b> <span> {data?.created_id} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span> <br/>
            <b> Visit : </b> <span> {data?.visit_cnt} </span> <br/>
            <ul id="ulNone"> 
                <b> Add Comment</b>
                <div id="div-align">
                    <textarea id="add" placeholder="Add a comment"></textarea> <button id="btn-detail"> Add </button> <br/>
                </div>
                <b>&lt;Comment List&gt;</b>
                <li id="liNone"> 
                    <b> ID : </b> <span> {data?.comment?.id} </span> <br/>
                    <b> Content : </b> <span> {data?.comment?.content} </span> <br/>
                    <b> Created At : </b> <span> {data?.comment?.created_at} </span> <br/>
                    {/* {commentDataArr?.map((comment, index)=>{
                        <CommentData data={comment} index={index} />
                    })} */}
                </li>
            </ul>
            <nav>
                <Link to={`/`}>
                    <button id="btn-detail"> Home </button></Link>
                <Link to={`/board`}>
                    <button id="btn-detail"> List </button></Link>
            </nav>
        </div>
    );
}

function CommentData({data, index}){
    return(
        <li id="liNone" key={index}>
            <b> Comment ID : </b> <span> {data.id} </span> <br/>
            <b> Content : </b> <span> {data.content} </span> <br/>
            <b> Created At : </b> <span> {data.created_at} </span> <br/>
            <br/>
        </li>
    )
}


export default ArticleDeatil;