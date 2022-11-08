import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import _ from "lodash";
import { getUrlId, ifError } from "../func";
import ArticleList from "./ArticleList";

function ArticleSearchList({user}) {
    const searchParam = useMemo(() => getUrlId(1).split("-"), []);
    
    const decodeParam = decodeURI(searchParam[2]);

    const [searchResults, setSearchResults] = useState({ data : {} });
    
    useEffect(() => {
        axios.get(`/board/search/${searchParam[0]}-${searchParam[1]}/${searchParam[2]}`)
        .then((res) => {
            setSearchResults(res?.data);
        })
        .catch((e) => {
            ifError(e);
        });
    }, [searchParam]);

    
    if(_.isEmpty(searchResults)){ 
        return (
            <div className="div-box" style={{ margin: "20px" , marginTop: "80px"}}>
                <pre style={{ fontSize: "17px" }}> 
                    
                    <b style={{fontSize: "25px"}}>Sorry, We cannot find any result. <br/> Please return to board. </b> <br/><br/>
                    There's no article contains <b>"{decodeParam}"</b> in it's <b>{searchParam[1]}</b>. <br/> 
                </pre>
            </div> 
        )
    }
    else {
        return (
            <div className='div-box'>
                <b style={{ fontSize: "30px"}}> Search results for keyword "{decodeParam}"</b>
                <ArticleList user={user} articleList={Array.from(searchResults)} keyword={searchParam[2]} />
            </div>
        )
    }
}

export default ArticleSearchList;