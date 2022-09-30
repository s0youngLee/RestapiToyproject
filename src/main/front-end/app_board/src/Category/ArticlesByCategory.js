import React, { useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import Article from "../Article/Article";
import _ from 'lodash';

function ArticlesByCategory({category}){
    const urlList = ((window.location.href).split('/'));
    const categoryId = urlList[(urlList.length)-1]

    const [articleByCategory, setArticleByCategory] = useState({  data : {}  });
    const [categoryName, setCategoryName] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const RES = fetch(`/board/category/${categoryId}`)
                    .then(res =>  res.json())
                    .then(result => {
                        setArticleByCategory(result);
                        for(let i = 0; i<category.length; i++){
                            if(_.isEqual(categoryId,(String)(category[i]?.id))){
                                setCategoryName(category[i].name);
                                break;
                            }
                        }
                        setLoading(false);
                    });
    }, []);
    
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
                <Link to={`/board`} id="none"><button id="btn-default"> Board </button></Link>
                <Link to={`/board/add/${categoryId}`} id="none"> <button id="btn-post"> Write </button></Link> 
                <br/>
            </div>
        </div>
    )}
}

export default ArticlesByCategory;