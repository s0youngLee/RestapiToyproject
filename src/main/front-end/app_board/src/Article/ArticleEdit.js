import {useState, useCallback} from "react";
import * as Function from "../func";
import axios from "axios";

function ArticleEdit(){
    const articleDetail = Function.Fetching("board", 1);
    const categoryList = Function.Fetching("category", NaN);

    if(!articleDetail) {return <div> Loading ... </div>}
    else { 
        return <ArticleEditForm articleDetail={articleDetail} categoryList={categoryList}/>
    }
}


function ArticleEditForm({articleDetail, categoryList}) {
    const [title, setTitle] = useState(articleDetail.title);
    const [content, setContent] = useState(articleDetail.content);
    const [createdId, setCreatedId] = useState(articleDetail.created_id);

    const editCreatedId = useCallback(e => {
        setCreatedId(e.target.value);
    }, [])

    const editTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const editContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const [selected, setSelected] = useState(articleDetail.category_id);
    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const editArticle = (e) => {
        if(Function.isEmpty(e.target.value)){ setCreatedId(articleDetail.title); }
        if(Function.isEmpty(e.target.value)){ setTitle(articleDetail.content); }
        if(Function.isEmpty(e.target.value)){ setContent(articleDetail.created_id); }
        
        axios.put(`/board/${articleDetail?.id}`, {
            data : {
                title : title,
                content : content,
                created_id : createdId,
                category_id : selected
            }
        }).catch((e) => {
            console.log(e.response);
            alert("Failed to edit article.\nPlease try again.");
        });
        
        if(e) {
            alert("Article Edited");
        }
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
                    <input placeholder={articleDetail.created_id} onChange={editCreatedId}></input> <br/>
                    <input placeholder={articleDetail.title} onChange={editTitle}></input> <br/>
                    <textarea id="text-box" placeholder={articleDetail.content} onChange={editContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/board/${articleDetail?.id}`}}> Save </button>
                </div>
            </form>
            <button id="btn-remove" 
                        onClick={() => {window.location.href=`/board/${articleDetail?.id}`}}> Back </button>
        </div>
    )
}

export default ArticleEdit;