import { useState } from "react";
import axios from "axios";

function CategoryRegister(){    
    const [writeData, setWriteData] = useState({
        id: "",
        name: ""
    });

    const onChangeData = (e) => {
        setWriteData({
            ...writeData,
            [e.target.name]: [e.target.value]
        });
    };

    const addCategory = (e) => {
        e.preventDefault();
        
        axios.post('/category', {
            id: writeData.id[0],
            name: writeData.name[0]
        }).then(() => {
            alert("카테고리가 등록되었습니다.\n등록한 " + writeData.name + " 로 이동합니다.");
            window.location.href=`/board/${writeData.name}/${writeData.id}`;
        }).catch((e) => {
            console.log(e.response);
            alert("카테고리 등록에 실패했습니다.\nError : " + e.response.statusText);
            window.location.reload();
        });

    }

    return(
        <div className="div-box">
            <form onSubmit={addCategory}>
                <b style={{ fontSize: "40px"}}> 새 카테고리 </b> <hr/>
                <input type={"text"} name="id" placeholder="Category ID" onChange={onChangeData} required></input> <br/>
                <input type={"text"} name="name" placeholder="Category Name" onChange={onChangeData} required></input> <br/>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > 등록 </button>
                <button onClick={() => {window.location.href='/category'}} 
                        className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"> 뒤로가기 </button>
            </form>
        </div>
    )
}

export default CategoryRegister;