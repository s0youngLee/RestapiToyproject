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
            window.location.href=`/board/category/${id}`;
        }).catch((e) => {
            alert("Failed to add category.\nError : " + e.response.statusText);
            window.location.reload();
        });

    }

    return(

        <div className="div-box">
            <form onSubmit={addCategory}>
                    <b style={{ fontSize: "40px"}}> Add Category </b> <hr/>
                    <input type={"text"} placeholder="Category ID" onChange={addId}></input> <br/>
                    <input type={"text"} placeholder="Category Name" onChange={addName}></input> <br/>
                    <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Add </button>
                    <button onClick={() => {window.location.href='/category'}} 
                            className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"> Back </button>
            </form>
        </div>
    )
}

export default CategoryRegister;