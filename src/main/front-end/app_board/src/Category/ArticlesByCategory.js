import { useState, useEffect } from "react";
import _ from 'lodash';
import { useLocation } from "react-router-dom";
import ArticleList from '../Article/ArticleList';
import { FetchWithId, getUrlId, ifError, suggestLogin } from "../func";
import axios from "axios";


function ArticlesByCategory(){
    const category = getUrlId(2);
    const [articleByCategory, setArticleByCategory] = useState();
    const [categoryData, setCategoryData] = useState();
    const [articleByCategoryData, setArticleByCategoryData] = useState();
    const currentloaction = useLocation();

    useEffect(() => {
        if(_.isEmpty(articleByCategoryData) && !_.isEqual(articleByCategoryData, [])){
            FetchWithId(articleByCategoryData, setArticleByCategoryData, "article/category", 1);
        }else{
            setArticleByCategory(articleByCategoryData);
        }
    }, [categoryData, articleByCategoryData]);

    useEffect(() => {
        setCategoryData(undefined);
        setArticleByCategoryData(undefined);
        console.log(currentloaction);
        pageviewCount();
    },[currentloaction]);

    function pageviewCount(){
        axios.post(`/pageview/${("{"+currentloaction.pathname+"}")}`, {
            page_url : 
        })
        .catch((e) => {
            ifError(e);
        });
    }
    
    if(_.isEmpty(category)) { return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else {
    return (
        <div className='div-box'>
            <b style={{ fontSize: "30px"}}> 카테고리 : {category} </b>
            {_.isEmpty(articleByCategory) && 
                <div> 
                    <b style={{fontSize: "30px"}}> No Articles </b>
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        onClick={() => { suggestLogin() }}> 글 작성 </button>
                </div>}
            {!_.isEmpty(articleByCategory) && <ArticleList articleList={Array.from(articleByCategory).reverse()} />}
        </div>
    )}
}

export default ArticlesByCategory;