import { useState, useCallback } from "react";
import _ from "lodash";

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
                    <input type={"image"} src={require("../searchIcon.png").default} alt={"icon"}
                           style={{width:"30px", height:"30px", objectFit: "fill", verticalAlign: "middle"}} />
                </div>
            </form>
        </div>
    )
}

export default SearchForm;