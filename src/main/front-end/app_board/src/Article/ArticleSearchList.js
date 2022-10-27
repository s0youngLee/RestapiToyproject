import _ from "lodash";
import { FetchWithId, getUrlId } from "../func";
import ArticleList from "./ArticleList";

function ArticleSearchList({user}) {
    const searchResults = Array.from(FetchWithId("board/search", 1));
    
    if(_.isEmpty(searchResults)){ return <div> Loading ... </div> }
    else {
        return (
            <div className='div-box'>
                <b style={{ fontSize: "30px"}}> Keyword : {getUrlId(1)} </b>
                <ArticleList user={user} articleList={searchResults} />
            </div>
        )
    }
}

export default ArticleSearchList;