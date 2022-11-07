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
                <ArticleList user={user} articleList={Array.from(searchResults)} />
            </div>
        )
    }
}

export default ArticleSearchList;