import React, {useState, useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import Comment from "../Comment/Comment";


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
                    <div style={{float: "right"}}>
                        <Link to={`/board/${data.id}/edit`} id="none" >
                            <button style={{float: "right"}} id="btn-post"> Edit </button></Link>
                        <button id="btn-remove" 
                                onClick={() => { deleteArticle(data.id) }}>Delete</button>
                    </div>
                    <br/> <br/>
                    <div style={{float: "right"}}>
                        <Link to={`/`} id="none">
                                <button id="btn-default"> Home </button></Link>
                        <Link to={`/board`} id="none">
                                <button id="btn-default"> Article List </button></Link>
                        <Link to={`/category/${data?.category_id}`} id="none">
                            <button id="btn-default"> {data?.category_name} List </button></Link>
                    </div>
                </div>
            </div>
            <Comment />
        </div>
    );
}

export default ArticleDeatil;