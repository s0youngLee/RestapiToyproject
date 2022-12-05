import { useState, useEffect } from "react";
import _ from 'lodash';
import { FetchWithoutId } from '../func';
import ArticleList from './ArticleList';
import '../App.css'

function Board(){
    const [article, setArticle] = useState();
    const [articleData, setArticleData] = useState();

    useEffect(() => {
        if(_.isEmpty(articleData)){
            FetchWithoutId(articleData, setArticleData, "article");
        }else{
            setArticle(articleData);
        }
    }, [articleData]);
    
    if(_.isEmpty(article)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else {
        return (
            <div className='div-box'> 
                <b style={{ fontSize: "30px", margin : "10px"}}> 게시판 </b><br/>
                <ArticleList articleList={Array.from(article).reverse()}/>
            </div>
        )
    }
}

export default Board;