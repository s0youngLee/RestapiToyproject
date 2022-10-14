import axios from "axios";
import {useState, useCallback} from "react";
import { Fetching, getUrlId, isEmpty } from "../func";


function CategoryEdit(){
    const category = Fetching("category", 1);
    if(!category) {return <div> Loading ... </div>}
    else { 
        return (
            <div style={{textAlign: "center"}}>
                <CategoryEditForm categoryId={getUrlId(1)} nameOrigin={category?.name}/>
                <button id="btn-remove" 
                        onClick={() => {window.location.href=`/category`}}> Back </button>
            </div>
        )
    }
}

function CategoryEditForm({categoryId, nameOrigin}){
    const [categoryName, setCategoryName] = useState(nameOrigin);
    
    const editName = useCallback( e => {
        setCategoryName(e.target.value);
    }, [])
    
    const editCategory = (e) => {
        if(isEmpty(e.target.value)){ setCategoryName(nameOrigin); }

        axios.put(`/category/${categoryId}`, {
            data : {
                name: categoryName
            }
        }).then(() => {
            alert("Category edited. Move to " + categoryName);
            window.location.replace("/category");
        }).catch((e) => {
            alert("Failed to edit category.\nError : " + e.response.statusText);
            window.location.replace("/category");
        });
    }


    return (
        <><br/><br/><br/>
        <form onSubmit={editCategory}>
            <div id="div-box">
                <b style={{textAlign: "center"}}> Edit Category </b> <br/>
                <input  placeholder={categoryId} readOnly></input> <br/>
                <input  placeholder={nameOrigin} onChange={editName}></input> <br/>
                <button type="submit" id="btn-post" style={{textAlign: "right"}}> Save </button>
            </div>
        </form></>
    )
}

export default CategoryEdit;