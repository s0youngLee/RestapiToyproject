import React, {useState, useCallback} from 'react';
import * as Function from "../func";
import axios from "axios";

function ArticleRegister(){
    let categoryId = Number(Function.getUrlId());
    if( Function.getUrlId() === ("board" || "add")){ 
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
        if(Function.isEmpty(createdId)){
            alert("You must input your ID!!!");
            return Error;
        }else{setCreatedId(createdId);}

        if(Function.isEmpty(title)){
            alert("You must input title!!!");
            return Error;
        }else{setTitle(title);}

        if(Function.isEmpty(content)){
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
                    <b> Category : </b>
                    <select onChange={handleSelect} value={selected}>
                        {Function.FetchingCategory()?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input placeholder="User ID" onChange={addCreatedId}></input> <br/>
                    <input placeholder="Title" onChange={addTitle}></input> <br/>
                    <textarea id="text-box" placeholder="Content" onChange={addContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board`}}> Add </button>
                </div>
            </form>
            <button style={{textAlign: "center"}} id='btn-default' > Home </button>
        </div>
    )
}

export default ArticleRegister;