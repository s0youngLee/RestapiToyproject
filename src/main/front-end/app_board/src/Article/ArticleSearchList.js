import _ from "lodash";
import { FetchWithId, getUrlId } from "../func";
import ArticleList from "./ArticleList";

function ArticleSearchList({user}) {
    const searchParam = getUrlId(1).split(",");
    
    const decodeParam = decodeURI(searchParam[1]);
    
    const searchResults = Array.from(FetchWithId(`board/search/${searchParam[0]}`, searchParam[1]));
    
    if(_.isEmpty(searchResults)){ 
        return (
            <div style={{ margin: "20px" }}>
                <b style={{ fontSize: "30px" }}> Keyword : {decodeParam} </b>
                <pre style={{ fontSize: "20px" }}> 
                    Cannot find any article contains "{decodeParam}". <br/> 
                    Please return to board. 
                </pre>
            </div> 
        )
    }
    else {
        return (
            <div className='div-box'>
                <b style={{ fontSize: "30px"}}> Keyword : {decodeParam} </b>
                <ArticleList user={user} articleList={searchResults} />
            </div>
        )
    }
}

export default ArticleSearchList;