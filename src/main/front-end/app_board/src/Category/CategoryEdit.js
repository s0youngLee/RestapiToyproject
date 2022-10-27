import axios from "axios";
import {useState, useCallback} from "react";
import { FetchWithId, getUrlId } from "../func";
import _ from 'lodash';


function CategoryEdit(){
    const category = FetchWithId("category", 1).data;
    if(_.isEmpty(category)) {return <div> Loading ... </div>}
    else { 
        return (
            <div style={{textAlign: "center"}}>
                <CategoryEditForm categoryId={getUrlId(1)} nameOrigin={category?.name}/>
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
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
        if(_.isEmpty(e.target.value)){ setCategoryName(nameOrigin); }

        axios.put(`/category/${categoryId}`, {
            data : {
                name: categoryName
            }
        }).then(() => {
            alert("Category edited. Move to " + categoryName);
            window.location.replace(`/board/category/${categoryId}`);
        }).catch((e) => {
            alert("Failed to edit category.\nError : " + e.response.statusText);
            window.location.reload();
        });
    }


    return (
        <><br/><br/><br/>
        <form onSubmit={editCategory}>
            <div className="div-box">
                <b style={{textAlign: "center"}}> Edit Category </b> <br/>
                <b> Category ID : {categoryId}</b><br/>
                <input  value={categoryName} onChange={editName}></input> <br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        style={{textAlign: "right"}}> Save </button>
            </div>
        </form></>
    )
}

export default CategoryEdit;