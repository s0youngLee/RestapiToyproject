import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function CategoryRegister(){    
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    
    const currentloaction = useLocation();
    useEffect(() => {
        console.log(currentloaction);
    }, [currentloaction]);

    const addId = useCallback(e => {
        setId(e.target.value);
    }, [])

    const addName = useCallback(e => {
        setName(e.target.value);
    }, [])
    

    const addCategory = (e) => {
        e.preventDefault();
        setId(id);
        setName(name);

        axios.post('/category', {
            id : id,
            name : name
        }).then(() => {
            alert("카테고리가 등록되었습니다.\n 새로 등록한 카테고리 " + name + " 로 이동합니다.");
            window.location.href=`/board/category/${id}`;
        }).catch((e) => {
            alert("카테고리 등록에 실패했습니다.\nError : " + e.response.statusText);
            window.location.reload();
        });

    }

    return(

        <div className="div-box">
            <form onSubmit={addCategory}>
                    <b style={{ fontSize: "40px"}}> 새 카테고리 </b> <hr/>
                    <input type={"text"} placeholder="Category ID" onChange={addId} required></input> <br/>
                    <input type={"text"} placeholder="Category Name" onChange={addName} required></input> <br/>
                    <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > 등록 </button>
                    <button onClick={() => {window.location.href='/category'}} 
                            className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"> 뒤로가기 </button>
            </form>
        </div>
    )
}

export default CategoryRegister;