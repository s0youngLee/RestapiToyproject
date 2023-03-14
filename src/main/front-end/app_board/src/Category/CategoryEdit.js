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
        e.preventDefault();
        axios.put(`/category/${category.id}`, {
            name: categoryName
        }).then((res) => {
            alert("카테고리 수정이 완료되었습니다.\n" + categoryName +" 로 이동합니다.");
            window.location.href = `/board/${categoryName}/${category.id}`;
        }).catch((e) => {
            alert("카테고리 수정에 실패했습니다.\nError : " + e.response.statusText);
            window.location.reload();
        });
    }


    return (
        <>
            <form onSubmit={editCategory} style={{marginTop: "100px"}}>
                <b style={{textAlign: "center", fontSize: "25px"}}> 카테고리 수정 </b> <br/>
                <b> 변경 전 : {category.name}</b><br/>
                <input type={"text"} value={categoryName} onChange={editName} required></input> <br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 저장 </button>
                <button type={"reset"} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                        onClick={() => {window.location.href=`/category`}}> 뒤로가기 </button>
            </form>
        </>
    )
}

export default CategoryEdit;