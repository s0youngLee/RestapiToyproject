import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { FetchWithId, getUrlId } from "../func";
import _ from 'lodash';


function CategoryEdit(){
    const [category, setCategory] = useState();
    const [categoryData, setCategoryData] = useState();

    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithId(categoryData, setCategoryData, "category", 1);
        }else{
            setCategory(categoryData.data);
        }
    }, [categoryData]);

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
            alert("카테고리 수정이 완료되었습니다.\n카테고리 " + categoryName +" 로 이동합니다.");
            window.location.href = `/board/category/${categoryId}`;
        }).catch((e) => {
            alert("카테고리 수정에 실패했습니다.\nError : " + e.response.statusText);
            window.location.reload();
        });
    }


    return (
        <><br/><br/><br/>
        <form onSubmit={editCategory}>
            <div className="div-box">
                <b style={{textAlign: "center"}}> Edit Category </b> <br/>
                <b> Category ID : {categoryId}</b><br/>
                <input type={"text"} value={categoryName} onChange={editName}></input> <br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        style={{textAlign: "right"}}> Save </button>
            </div>
        </form></>
    )
}

export default CategoryEdit;