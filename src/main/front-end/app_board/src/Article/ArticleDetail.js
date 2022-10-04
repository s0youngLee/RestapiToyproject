import {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import Comment from "../Comment/Comment";
import * as Validation from "../validation";

function ArticleDeatil(){
    const articleDetail = Validation.Fetching(Validation.getUrlId());

    if(!articleDetail) { return <h1> Loading .. </h1>}
    else { return <ArticleDetailData data={articleDetail?.data}/>; }
}

function ArticleDetailData({data}) {
    const axios = require('axios');

    function deleteArticle(articleId) {
        alert("Aritcle Deleted");
        axios.delete(`/board/${articleId}`);
        window.location.href=`/board/category/${data?.category_id}`;
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
                        <Link to={`/board/edit/${data?.id}`} id="none" >
                            <button style={{float: "right"}} id="btn-post"> Edit </button></Link>
                        <button id="btn-remove" 
                                onClick={() => { deleteArticle(data.id) }}>Delete</button>
                    </div>
                    <br/> <br/>
                    <div style={{float: "right"}}>
                        <Link to={`/`} id="none">
                                <button id="btn-default"> Home </button></Link>
                        <Link to={`/board`} id="none">
                                <button id="btn-default"> Board </button></Link>
                        <Link to={`/board/category/${data?.category_id}`} id="none">
                            <button id="btn-default"> {data?.category_name} List </button></Link>
                    </div>
                </div>
            </div>
            <Comment article={data}/>
        </div>
    );
}

export default ArticleDeatil;