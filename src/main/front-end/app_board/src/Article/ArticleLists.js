import {Link} from 'react-router-dom';
import ArticleList from './ArticleList';
import '../App.css'
import { FetchWithoutId } from '../func';
import _ from 'lodash';
import { useState, useCallback } from "react";

function ArticleLists({user, isLogin}){
    const articleList = Array.from(FetchWithoutId("board").data);
    
    if(_.isEmpty(articleList)){ return <div> Loading... </div> }
    else {
        return (
            <div className='div-box'> 
                <b style={{ fontSize: "30px", margin : "10px"}}> Article List </b>
                <SearchForm />
                {isLogin && 
                    <Link to={`/board/add/0`} className="none"> 
                        <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 
                                Write article </button></Link>}
                <ArticleList user={user} articleList={articleList}/>
            </div>
        )
    }
}

function SearchForm(){
    const [searchParam, setSearchParam] = useState("");

    const handleParam = useCallback(e => {
        setSearchParam(e.target.value);
    }, []);

    const searchArticle = (e) => {
        e.preventDefault();
        if(!_.isEmpty(searchParam)){
            setSearchParam(searchParam);
        }

        window.location.replace(`/search/${searchParam}`);
    }

    return (
        <div className="search-container">
            <form onSubmit={searchArticle}>
                <div>
                    <input type="text" placeholder="Please enter your keyword(s) to search." name="search" onChange={handleParam} required/>
                    <input type={"image"} src={require("../searchIcon.png").default} style={{width:"30px", height:"30px", objectFit: "fill", verticalAlign: "middle"}} />
                </div>
            </form>
        </div>
    )
}


export default ArticleLists;