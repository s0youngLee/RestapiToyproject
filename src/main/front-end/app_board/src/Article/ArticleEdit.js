import {useState, useCallback} from "react";
import * as Function from "../func";

function ArticleEdit(){
    const articleDetail = Function.FetchingArticle(Function.getUrlId());
    const categoryList = Function.FetchingCategory();

    if(!articleDetail) {return <div> Loading ... </div>}
    else { 
        return (
        <ArticleEditForm articleDetail={articleDetail} categoryList={categoryList}/>
    )}
}


function ArticleEditForm({articleDetail, categoryList}) {
    const axios = require('axios');

    const [title, setTitle] = useState(articleDetail.data.title);
    const [content, setContent] = useState(articleDetail.data.content);
    const [createdId, setCreatedId] = useState(articleDetail.data.created_id);

    const editCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const editTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const editContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const [selected, setSelected] = useState(articleDetail.data.category_id);
    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const editArticle = (e) => {
        if(Function.isEmpty(e.target.value)){ setCreatedId(articleDetail.data.title); }
        if(Function.isEmpty(e.target.value)){ setTitle(articleDetail.data.content); }
        if(Function.isEmpty(e.target.value)){ setContent(articleDetail.data.created_id); }
        
        axios.put(`/board/${articleDetail?.data?.id}`, {
            data : {
                title : title,
                content : content,
                created_id : createdId,
                category_id : selected
            }
        });
        
        alert("Article Edited");
    }

    return(
        <div id="div-box">
            <form onSubmit={editArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Edit Article </b> <br/>
                    <b> Category : </b>
                    <select onChange={handleSelect} value={selected}>
                        {categoryList?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input placeholder={articleDetail.data.created_id} onChange={editCreatedId}></input> <br/>
                    <input placeholder={articleDetail.data.title} onChange={editTitle}></input> <br/>
                    <textarea id="text-box" placeholder={articleDetail.data.content} onChange={editContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board/${articleDetail?.data?.id}`}}> Save </button>
                </div>
            </form>
            <button id="btn-remove" 
                        onClick={() => {window.location.href=`/board/${articleDetail?.data?.id}`}}> Back </button>
        </div>
    )
}

export default ArticleEdit;