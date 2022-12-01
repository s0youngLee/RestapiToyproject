import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import _ from "lodash";
import { getUrlId, ifError } from "../func";
import ArticleList from "./ArticleList";
import { useLocation } from "react-router-dom";

function ArticleSearchList() {
    const searchParam = useMemo(() => getUrlId(1).split("-"), []);
    const decodeParam = decodeURI(searchParam[2]);
    const [searchResults, setSearchResults] = useState({ data : {} });

    
    const currentloaction = useLocation();
    useEffect(() => {
        console.log(currentloaction);
    }, [currentloaction]);
    
    useEffect(() => {
        axios.get(`/article/search/${searchParam[0]}-${searchParam[1]}/${searchParam[2]}`)
        .then((res) => {
            setSearchResults(res?.data);
        })
        .catch((e) => {
            ifError(e);
        });
    }, [searchParam]);

    
    if(_.isEmpty(searchResults)){ 
        return (
            <div className="div-box">
                <p style={{ fontSize: "17px" }}> 
                    <b style={{fontSize: "25px"}}> 결과를 찾을 수 없습니다. </b> <br/><br/>
                    <b>"{decodeParam}"</b> 이(가) 포함된 게시글이 없습니다. <br/> 
                </p>
            </div> 
        )
    }
    else {
        return (
            <div className='div-box'>
                <b style={{ fontSize: "30px"}}> "{decodeParam}" 에 대한 검색 결과</b> 
                <ArticleList articleList={Array.from(searchResults)} />
            </div>
        )
    }
}

export default ArticleSearchList;