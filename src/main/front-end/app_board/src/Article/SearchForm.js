import { useState } from "react";
import { getUrlId } from "../func";

function SearchForm(){
    const categoryId = isNaN(Number(getUrlId(1))) ? "" : getUrlId(1);
    const searchType = ["Title", "Content", "Title+Content", "Nickname"];
    const [searchData, setSearchData] = useState({
        type : "Title+Content",
        search : ""
    })

    const onChangeSearch = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: [e.target.value]
        });
    };

    const searchArticle = (e) => {
        e.preventDefault();
        
        window.location.href = `/search/${categoryId}-${searchData.type}-${searchData.search}`;
    }

    return(
        <>
        <form onSubmit={searchArticle} style={{margin: "5px", width: "45vh", display: "inline-block"}}>
            <select onChange={onChangeSearch} name="type" value={searchData.type} style={{width: "30%", verticalAlign: "top"}}>
                {searchType.map((type, index) => {
                    return <option key={index} value={type}>{type}</option>;
                })}
            </select>
            <input type="text" style={{width: "60%", margin: "0", marginRight: "5px"}}
                    placeholder="검색어를 입력하세요." name="search" onChange={onChangeSearch} required/>
            <input type={"image"} src={require("../Icon/search.png").default} alt={"icon"}
                style={{width:"30px", height:"30px", objectFit: "fill", verticalAlign: "middle"}} />
        </form> 
        </>
    )
}

export default SearchForm;