import React, {useState, useCallback} from "react";
import axios from "axios";

function CategoryRegister(){    
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
        }).then(() => {
            alert("Category registerd. Move to " + name);
            window.location.replace(`/board/category/${id}`);
        }).catch((e) => {
            alert("Failed to add category.\nError : " + e.response.statusText);
            window.location.replace("/category");
        });

    }

    return(
        <>
            <br/><br/><br/>
            <form onSubmit={addCategory}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Category </b> <br/>
                    <input  placeholder="Category ID" onChange={addId}></input> <br/>
                    <input  placeholder="Category Name" onChange={addName}></input> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}> Add </button>
                </div>
            </form>
        </>
    )
}

export default CategoryRegister;