import {useState, useCallback, useEffect} from "react";
import * as Validation from "../validation";


function CategoryEdit(){
    const [category, setCategory] = useState({
        data : {}
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(()=> {
        const RES = fetch(`/category/${Validation.getUrlId()}`)
        .then(res =>  res.json())
        .then(result => {
            setCategory(result);
            setLoading(false);
        });
    },[]);

    if(loading) {return <div> Loading ... </div>}
    else { 
        return (
            <div>
                <CategoryEditForm categoryId={Validation.getUrlId()} nameOrigin={category.data?.name}/>
                <button id="btn-remove"
                        onClick={() => {window.location.href=`/category`}}> Back </button>
            </div>
        )
    }
}

function CategoryEditForm({categoryId, nameOrigin}){
    const axios = require('axios');
    const [categoryName, setCategoryName] = useState(nameOrigin);
    
    const editName = useCallback( e => {
        setCategoryName(e.target.value);
    }, [])

    const editCategory = (e) => {
        if(Validation.isEmpty(e.target.value)){ setCategoryName(nameOrigin); }

        axios.put(`/category/${categoryId}`, {
            data : {
                name: categoryName
            }
        })
        alert("category: " + nameOrigin + " id: " + categoryId + " edited. \n After : " + categoryName);
    }


    return (
        <><br/><br/><br/>
        <form onSubmit={editCategory}>
            <div id="div-box">
                <b style={{textAlign: "center"}}> Edit Category </b> <br/>
                <input id="id-box" placeholder={categoryId} readOnly></input> <br/>
                <input id="id-box" placeholder={nameOrigin} onChange={editName}></input> <br/>
                <button type="submit" id="btn-post" style={{textAlign: "right"}}
                     onClick={() => {window.location.href=`/category`}}> Save </button>
            </div>
        </form></>
    )
}

export default CategoryEdit;