import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import Article from "../Article/Article";
import CategoryBar from "../Category/CategoryBar";
import '../App.css'

function ArticleLists({category}){
    const [articleList, setArticleList] = useState({
        data : {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const RES = fetch('/board')
                    .then((res) => res.json())
                    .then((result) => {
                        setArticleList(result);
                        setLoading(false);
                    });
    }, [])

    const articleListArr = Array.from(articleList.data);

    if(loading) { return <div> Loading ... </div> }
    else {
        return (
        <div>
            <CategoryBar category={category}/>
            <h1 style={{color: "#373737", textAlign:"center"}}> Aritcle List </h1> 
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
                        <tr key={index}><Article data={article}/></tr>
                        ))}
                </tbody>
            </table>
            <br/>
            <div style={{width: "100%", textAlign: "center"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/board/add/0`} id="none"> <button id="btn-post"> Write </button></Link>
            </div>
        </div>
    )}
}


export default ArticleLists;


