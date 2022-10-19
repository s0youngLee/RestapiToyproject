import { useState, useCallback } from "react";
import _ from 'lodash';
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
    

    const addCategory = (e) => {
        e.preventDefault();
        if(_.isEmpty(id)){
            alert("You must input your ID!!!");
            return Error;
        }else{setId(id);}

        if(_.isEmpty(name)){
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
            window.location.reload();
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
                    <button type="submit" id="btn-post" > Add </button>
                </div>
            </form>
        </>
    )
}

export default CategoryRegister;