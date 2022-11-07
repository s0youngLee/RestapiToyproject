import { useState, useCallback } from "react";
import _ from "lodash";

function SearchForm(){
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
        window.location.href = `/search/${searchTypeParam},${searchParam}`;
    }


    return(
        <form onSubmit={searchArticle} style={{width: "45vh", display: "inline-block"}}>
            <select onChange={handleSelect} value={searchTypeParam}>
                {searchType.map((type, index) => {
                    return <option key={index} value={type}>{type}</option>;
                })}
            </select><br/>
            <input type="text" style={{width: "90%", margin: "0", marginRight: "5px"}} 
                    placeholder="Please enter your keyword(s) to search." name="search" onChange={handleParam} required/>
            <input type={"image"} src={require("../search.png").default} alt={"icon"}
                style={{width:"30px", height:"30px", objectFit: "fill", verticalAlign: "middle"}} />
        </form>
    )
}

export default SearchForm;