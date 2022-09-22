import React, { useEffect, useState } from "react";
import './App.css'
import {Link} from 'react-router-dom';

function ArticleLists(props){
    const [articleList, setArticleList] = useState({
        data : {}
    });

    useEffect(()=> {
        setArticleList(props.ArticleLists);
    },[props.ArticleLists, articleList])

    const articleListArr = Array.from(articleList.data);

    return (
        <div>
            {articleListArr.map((article, index) => (
                <Article data={article} index={index} />
            ))}
        </div>
    )
}


function Article({data, index}) {

    return (
        <li id="liNone" key={index}>
            <b>ID : </b> <span>{data.id}</span> <br/>
            <b>Title : </b> <span>{data.title}</span> <br/>
            <b>Category : </b> <span>{data.category_name}</span> <br/>
            <b>Created By : </b> <span>{data.created_id}</span> <br/>
            <b>Created At : </b> <span>{data.created_at}</span> <br/>
            <b>Visit : </b> <span>{data.visit_cnt}</span> <br/>
            <b>Comment : </b> <span>{data.comment_cnt}</span> <br/>
            <nav>
                <Link to={`/`}>
                    <button id="btn-detail"> Home </button></Link>
                <Link to={`/board/${data.id}`}>
                    <button id="btn-detail"> Detail </button></Link>
            </nav>
        </li>
    );
}

export default ArticleLists;


