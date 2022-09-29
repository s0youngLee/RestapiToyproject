import React, {useState, useEffect, useCallback} from "react";

function ArticleEdit(){
    const urlList = ((window.location.href).split('/'));
    const articleId = urlList[(urlList.length)-2];
    
    const [articleDetail, setArticleDetail] = useState({
        data : {}
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(()=> {
        const RES = fetch(`/board/${articleId}`)
        .then(res =>  res.json())
        .then(result => {
            setArticleDetail(result);
            setLoading(false);
        });
    },[]);

    if(loading) {return <div> Loading ... </div>}
    else { 
        return (
        <ArticleEditForm titleOrigin={articleDetail?.data?.title}
                         contentOrigin={articleDetail?.data?.content}
                         categoryOrigin={articleDetail?.data?.category_id} 
                         idOrigin={articleDetail?.data?.created_id} 
                         articleId={articleDetail?.data?.id}/>
    )}
}


function ArticleEditForm({titleOrigin, contentOrigin, categoryOrigin, idOrigin, articleId}) {
    const axios = require('axios');

    const [title, setTitle] = useState(titleOrigin);
    const [content, setContent] = useState(contentOrigin);
    const [category, setCategory] = useState(categoryOrigin);
    const [createdId, setCreatedId] = useState(idOrigin);

    const editCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const editTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const editCategory = useCallback(e => {
        setCategory(e.target.value);
    }, [])
    
    const editContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const isEmpty = function(value){
        if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
            return true;
        }else { return false; }
    }

    const editArticle = (e) => {
        if(isEmpty(e.target.value)){ setCreatedId(idOrigin); }
        if(isEmpty(e.target.value)){ setTitle(titleOrigin); }
        if(isEmpty(e.target.value)){ setTitle(categoryOrigin); } 
        if(isEmpty(e.target.value)){ setContent(contentOrigin); }
        
        axios.put(`/board/${articleId}`, {
            data : {
                title : title,
                content : content,
                created_id : createdId,
                category_id : category
            }
        });
        
        alert("Article Edited");
    }

    return(
        <div id="div-box">
            <form onSubmit={editArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Edit Article </b> <br/>
                    <input id="id-box" placeholder={idOrigin} onChange={editCreatedId}></input> <br/>
                    <input id="id-box" placeholder={titleOrigin} onChange={editTitle}></input> <br/>
                    <input id="id-box" placeholder={categoryOrigin} onChange={editCategory} ></input> <br/>
                    <textarea id="text-box" placeholder={contentOrigin} onChange={editContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board/${articleId}`}}> Save </button>
                </div>
            </form>
        </div>
    )
}

export default ArticleEdit;