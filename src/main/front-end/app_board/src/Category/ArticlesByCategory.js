import React, { useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import Article from "../Article/Article";

function ArticlesByCategory(){
    const urlList = ((window.location.href).split('/'));
    const categoryId = urlList[(urlList.length)-1]

    const [articleByCategory, setArticleByCategory] = useState({
        data : {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const RES = fetch(`/category/board/${categoryId}`)
                    .then(res =>  res.json())
                    .then(result => {
                        setArticleByCategory(result);
                        setLoading(false);
                    });
    },[]);

    const [categoryList, setCategoryList] = useState({
        data : {}
    });
    const [categoryName, setCategoryName] = useState();

    useEffect(()=> {
        const RES = fetch('/category')
                    .then((res) => res.json())
                    .then((result) => setCategoryList(result));

        const matchCategoryId = Number(categoryId);
        for(let i=0;i<categoryList.data.length;i++){
            if(categoryList.data[i].id === matchCategoryId){
                setCategoryName(categoryList.data[i].name);
            }
        }
    }, [categoryList])

    function deleteCategory(categoryId, categoryName) {
        const axios = require('axios');

        if(categoryId==="0"){
            alert("You cannot Remove DEFAULT category!!");
            return Error;
        }else{
            alert("Deleted Category " + categoryName + ", the articles are moved to DEFAULT category.");
            axios.delete(`/category/${categoryId}`);
            window.location.href="/category/board/0";
        }
    }
    
    if(loading) { return <div> Loading ... </div> }
    else {
        return (
        <div>
            <div>
                <h1 style={{color: "#373737", textAlign:"center"}}> Category : {categoryName} </h1> 
            </div>
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
                    {articleByCategory?.data?.map((article, index) => (
                        <tr key={index}><Article data={article} /></tr>
                        ))}
                </tbody>
            </table>
            <br/>
            <div style={{width: "100%", textAlign: "center"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/category`} id="none"><button id="btn-default"> Category List </button></Link>
                <Link to={`/board/add/${categoryId}`} id="none"> <button id="btn-post"> Write </button></Link> 
                <Link to={`/category/${categoryId}/edit`} id="none"> <button id="btn-post"> Edit Category Name</button></Link>
                <br/>
                <button id="btn-remove" onClick={() => { deleteCategory(categoryId, categoryName) }}> 
                        Delete Category : {categoryName} </button>
            </div>
        </div>
    )}
}

export default ArticlesByCategory;