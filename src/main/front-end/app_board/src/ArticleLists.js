import React, { useEffect, useState, useCallback } from "react";
import './App.css'
import {Link} from 'react-router-dom';

function ArticleLists(props){
    const [articleList, setArticleList] = useState({
        data : {}
    });

    useEffect(()=> {
        const RES = fetch('/board')
                    .then((res) => res.json())
                    .then((result) => setArticleList(result));
    }, [articleList])

    const articleListArr = Array.from(articleList.data);

    return (
        <div>
            <table id="list">
                <thead>
                    <tr>
                        <th id="item"> ID </th>
                        <th id="item"> Title </th>
                        <th id="item"> Category </th>
                        <th id="item"> Created By </th>
                        <th id="item"> Created At </th>
                        <th id="item"> Visit </th>
                        <th id="item"> Comment </th>
                    </tr>
                </thead>
                <tbody>
                    {articleListArr.map((article, index) => (
                        <tr> <Article data={article}/></tr>
                        ))}
                </tbody>
            </table>
            <br/>
            <div style={{width: "100%", textAlign: "center"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
            </div>
            <ArticleRegister />
        </div>
    )
}

function ArticleRegister(){
    const urlList = ((window.location.href).split('/'));
    const articleId = urlList[(urlList.length)-1]

    const axios = require('axios');
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [createdId, setCreatedId] = useState("");

    const addCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const addTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const addCategory = useCallback(e => {
        setCategory(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const addArticle = (e) => {
        e.preventDefault();

        if(createdId === (null || "")){
            alert("You must input your ID!!!");
            return Error;
        }else{setCreatedId(createdId);}

        if(title === (null || "")){
            alert("You must input title!!!");
            return Error;
        }else{setTitle(title);}
        
        if(category === (null || "")){
            alert("You must input category!!!");
            return Error;
        }else{setCategory(category);}

        if(content === (null || "")){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post('/board', {
            data : {
                created_id : "",
                title : "",
                category_id : "",
                content : ""
            }
        });
        
        alert("Article registerd");
    }

    return(
        <div>
            <br/><br/><br/>
            <form onSubmit={addArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Article </b> <br/>
                    <input id="id-box" placeholder="User ID" onChange={addCreatedId}></input> <br/>
                    <input id="id-box" placeholder="Title" onChange={addTitle}></input> <br/>
                    <input id="id-box" placeholder="Category" onChange={addCategory}></input> <br/>
                    <textarea id="text-box" placeholder="Content" onChange={addContent}></textarea> <br/>
                    <button type="submit" id="btn-add" style={{textAlign: "right"}}> Add </button>
                </div>
            </form>
        </div>
    )
}



function Article({data}) {

    return (
        <>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.id} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.title} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.category_name} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.created_id} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.created_at} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.visit_cnt} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.comment_cnt} </Link> </td>
        </>
    );
}

export default ArticleLists;


