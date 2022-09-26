import axios from "axios";
import React, {useState, useEffect, useCallback} from "react";
import {Link} from 'react-router-dom';
import Article from './ArticleLists';
import ArticleDeatil from "./ArticleDetail";

function ArticlesByCategory(){
    const urlList = ((window.location.href).split('/'));
    const categoryId = urlList[(urlList.length)-1]
    console.log(categoryId);

    const [articleByCategory, setArticleByCategory] = useState({
        data : {}
    });

    useEffect(()=> {
        const RES = fetch(`/category/board/${categoryId}`)
                    .then(res =>  res.json())
                    .then(result => setArticleByCategory(result));

        // const RES = axios.get(`/category/board/${categoryId}`);
        // console.log(RES);
        // setArticleByCategory(RES);
    },[]);

    console.log(articleByCategory);
    const articleListArr = articleByCategory.data;

    return (
        <div>
            <h1 style={{color: "#373737", textAlign:"center"}}> Category :  </h1>
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
                    {console.log(articleListArr)}
                    {articleListArr.map((article, index) => (
                        <tr> <Article data={article} index={index} /></tr>
                        ))}
                </tbody>
            </table>
            <br/>
            <div style={{width: "100%", textAlign: "center"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/`} id="none"> <button id="btn-default"> Add Article </button></Link>
            </div>
        </div>
    )
}


export default ArticlesByCategory;