import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { FetchWithId } from "../func";
import _ from 'lodash';


function CategoryEdit(){
    const [category, setCategory] = useState();
    const [categoryData, setCategoryData] = useState();

    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithId(categoryData, setCategoryData, "category", 1);
        }else{
            setCategory(categoryData);
        }
    }, [categoryData]);

    if(_.isEmpty(category)) {return <div> Loading ... </div>}
    else { 
        return (
            <div style={{textAlign: "center"}}>
                <CategoryEditForm category={category}/>
            </div>
        )
    }
}

function CategoryEditForm({category}){
    const [categoryName, setCategoryName] = useState(category.name);
    
    const editName = useCallback( e => {
        setCategoryName(e.target.value);
    }, []);
    
    const editCategory = (e) => {
        if(_.isEmpty(e.target.value)){ setCategoryName(category.name); }

        axios.put(`/category/${category.id}`, {
            name: categoryName
        }).then(() => {
            alert("카테고리 수정이 완료되었습니다.\n카테고리 " + categoryName +" 로 이동합니다.");
            window.location.href = `/board/category/${category.id}`;
        }).catch((e) => {
            alert("카테고리 수정에 실패했습니다.\nError : " + e.response.statusText);
            window.location.reload();
        });
    }


    return (
        <>
            <form onSubmit={editCategory} style={{marginTop: "100px"}}>
                <b style={{textAlign: "center", fontSize: "25px"}}> Edit Category </b> <br/>
                <b> Category ID : {category.id}</b><br/>
                <input type={"text"} value={categoryName} onChange={editName}></input> <br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Save </button>
                <button type={"reset"} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                        onClick={() => {window.location.href=`/category`}}> Back </button>
            </form>
        </>
    )
}

export default CategoryEdit;