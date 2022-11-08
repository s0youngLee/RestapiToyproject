import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { getUrlId } from "../func";

function SearchForm({isLogin}){
    const categoryId = isNaN(Number(getUrlId(1))) ? "" : getUrlId(1);
    // const searchType = ["Title", "Content", "Title+Content", "Nickname"];
    const searchType = ["Title", "Content", "Title+Content"];
    const [searchTypeParam, setSearchTypeParam] = useState("Title+Content");
    const [searchParam, setSearchParam] = useState("");

    const handleParam = useCallback(e => {
        setSearchParam(e.target.value);
    }, []);

    const handleSelect = useCallback(e => {
        setSearchTypeParam(e.target.value);
    }, []);

    const searchArticle = (e) => {
        e.preventDefault();
        
        if(!_.isEmpty(searchParam)){
            setSearchParam(searchParam);
        }
        window.location.href = `/search/${categoryId}-${searchTypeParam}-${searchParam}`;
    }


    return(
        <>
        <form onSubmit={searchArticle} style={{margin: "5px", width: "45vh", display: "inline-block"}}>
            <select onChange={handleSelect} value={searchTypeParam} style={{width: "23%"}}>
                {searchType.map((type, index) => {
                    return <option key={index} value={type}>{type}</option>;
                })}
            </select>
            <input type="text" style={{width: "60%", margin: "0", marginRight: "5px"}}
                    placeholder="Please enter your keyword(s) to search." name="search" onChange={handleParam} required/>
            <input type={"image"} src={require("../search.png").default} alt={"icon"}
                style={{width:"30px", height:"30px", objectFit: "fill", verticalAlign: "middle"}} />
        </form>
        {isLogin && 
            <Link to={`/board/add/0`} className="none"> 
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 
                        Write article </button></Link>}
        </>
    )
}

export default SearchForm;