import { useState, useEffect } from "react";
import _ from 'lodash';
import { useLocation } from "react-router-dom";
import ArticleList from '../Article/ArticleList';
import { FetchWithId, getUrlId, pageviewCount, suggestLogin } from "../func";


function ArticlesByCategory(){
    const category = decodeURI(getUrlId(2));
    const [articleByCategory, setArticleByCategory] = useState();
    const [categoryData, setCategoryData] = useState();
    const [articleByCategoryData, setArticleByCategoryData] = useState();
    // const currentlocation = useLocation();

    useEffect(() => {
        if(_.isEmpty(articleByCategoryData) && !_.isEqual(articleByCategoryData, [])){
            FetchWithId(articleByCategoryData, setArticleByCategoryData, "article/category", 1);
        }else{
            setArticleByCategory(articleByCategoryData);
        }
    }, [categoryData, articleByCategoryData]);

    useEffect(() => {
        // pageviewCount(currentlocation.pathname, category);
        setCategoryData(undefined);
        setArticleByCategoryData(undefined);
    },[category]);
    
    if(_.isEmpty(category)) { return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else {
    return (
        <div className='div-box'>
            <b style={{ fontSize: "30px"}}> {category} </b>
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