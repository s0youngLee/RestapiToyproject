import React, {useState, useCallback} from 'react';
import * as Validation from "../validation";
import axios from "axios";

function ArticleRegister({categoryList}){
    let categoryPlaceHolder = "Current Category : " + Validation.getUrlId();
    let categoryId = Number(Validation.getUrlId());
    if( Validation.getUrlId() === ("board" || "add" || "0")){ 
        categoryPlaceHolder = "Current Category : Default";
        categoryId = 0;
    }
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [createdId, setCreatedId] = useState("");

    const addCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const addTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    
    const [selected, setSelected] = useState(categoryId);
    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const addArticle = (e) => {
        if(Validation.isEmpty(createdId)){
            alert("You must input your ID!!!");
            return Error;
        }else{setCreatedId(createdId);}

        if(Validation.isEmpty(title)){
            alert("You must input title!!!");
            return Error;
        }else{setTitle(title);}

        if(Validation.isEmpty(content)){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post('/board', {
            data : {
                title : title,
                content : content,
                created_id : createdId,
                category_id : selected
            }
        });
        
        alert("Article registerd");
    }

    return(
        <div style={{textAlign: "center"}}>
            <br/><br/>
            <form onSubmit={addArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Article </b> <br/>
                    <input id="id-box" placeholder="User ID" onChange={addCreatedId}></input> <br/>
                    <input id="id-box" placeholder="Title" onChange={addTitle}></input> <br/>
                    <b> Category : </b>
                    <select onChange={handleSelect} value={selected}>
                        {categoryList.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <textarea id="text-box" placeholder="Content" onChange={addContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board`}}> Add </button>
                </div>
            </form>
            <button style={{textAlign: "center"}} id='btn-default' onClick={() => {window.location.href=`/board`}}> Home </button>
        </div>
    )
}

export default ArticleRegister;