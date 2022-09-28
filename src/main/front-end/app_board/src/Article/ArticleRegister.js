import React, {useState, useCallback} from 'react';

function ArticleRegister(){
    const urlList = ((window.location.href).split('/'));
    const id = urlList[(urlList.length)-1]
    let categoryPlaceHolder = "Current Category : " + Number(id);
    let categoryId = Number(id);
    if(id === "board" || id === "add" || id === "0"){ 
        categoryPlaceHolder = "Current Category : Default";
        categoryId = 0;
    }

    
    const axios = require('axios');
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState(categoryId);
    const [createdId, setCreatedId] = useState("");

    const addCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const addTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const addCategory = useCallback(e => {
        setCategory(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const isEmpty = function(value){
        if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
            return true;
        }else { return false; }
    }

    const addArticle = (e) => {
        if(isEmpty(createdId)){
            alert("You must input your ID!!!");
            return Error;
        }else{setCreatedId(createdId);}

        if(isEmpty(title)){
            alert("You must input title!!!");
            return Error;
        }else{setTitle(title);}
        
        if(isEmpty(category)){
            setCategory(categoryId);
        }else{setCategory(category);}

        if(isEmpty(content)){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post('/board', {
            data : {
                title : title,
                content : content,
                created_id : createdId,
                category_id : category
            }
        });
        
        alert("Article registerd");
    }

    return(
        <div>
            <br/><br/>
            <form onSubmit={addArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Article </b> <br/>
                    <input id="id-box" placeholder="User ID" onChange={addCreatedId}></input> <br/>
                    <input id="id-box" placeholder="Title" onChange={addTitle}></input> <br/>
                    <input id="id-box" placeholder={categoryPlaceHolder} onChange={addCategory}></input> <br/>
                    <textarea id="text-box" placeholder="Content" onChange={addContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board`}}> Add </button>
                </div>
            </form>
        </div>
    )
}

export default ArticleRegister;