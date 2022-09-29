import React, {useState, useCallback} from "react";

function CategoryRegister(){
    const axios = require('axios');
    
    const [id, setId] = useState("");
    const [name, setName] = useState("");

    const addId = useCallback(e => {
        setId(e.target.value);
    }, [])

    const addName = useCallback(e => {
        setName(e.target.value);
    }, [])
    
    
    const isEmpty = function(value){
        if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
            return true;
        }else { return false; }
    }

    const addCategory = (e) => {
        if(isEmpty(id)){
            alert("You must input your ID!!!");
            return Error;
        }else{setId(id);}

        if(isEmpty(name)){
            alert("You must input Name!!!");
            return Error;
        }else{setName(name);}

        axios.post('/category', {
            data : {
                id : id,
                name : name
            }
        });
        
        alert("Category registerd");
    }

    return(
        <>
            <br/><br/><br/>
            <form onSubmit={addCategory}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Category </b> <br/>
                    <input id="id-box" placeholder="Category ID" onChange={addId}></input> <br/>
                    <input id="id-box" placeholder="Category Name" onChange={addName}></input> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {
                                if((!isEmpty(id))&&(!isEmpty(name))){
                                    window.location.href=`/board/category/${id}`
                                } }}> Add </button>
                </div>
            </form>
        </>
    )
}

export default CategoryRegister;