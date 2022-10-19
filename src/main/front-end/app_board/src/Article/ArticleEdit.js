import {useState, useCallback} from "react";
import { FetchWithId, FetchWithoutId } from "../func";
import axios from "axios";
import _ from "lodash";

function ArticleEdit({user}){
    const articleDetail = FetchWithId("board", 1);
    const categoryList = Array.from(FetchWithoutId("category").data);

    if(!articleDetail) {return <div> Loading ... </div>}
    else { 
        return <ArticleEditForm articleDetail={articleDetail} categoryList={categoryList} user={user}/>
    }
}

function ArticleEditForm({articleDetail, categoryList, user}) {
    const [title, setTitle] = useState(articleDetail.title);
    const [content, setContent] = useState(articleDetail.content);
    const [selected, setSelected] = useState(articleDetail.category_id);

    const editTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const editContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const editArticle = (e) => {
        e.preventDefault();
        if(_.isEmpty(e.target.value)){ setTitle(articleDetail.title); }
        if(_.isEmpty(e.target.value)){ setContent(articleDetail.content); }
        
        axios.put(`/board/${articleDetail?.id}`, {
            data : {
                title : title,
                content : content,
                created_id : user?.nick_name,
                category_id : selected
            }
        }).then((res) => {
            alert("Article Edited");
            window.location.replace(`/board/${articleDetail?.id}`);
        }).catch((e) => {
            alert("Failed to edit article.\nPlease try again.");
            window.location.replace(`/board/${articleDetail?.id}`);
        });
    }
    
    return(
        <div id="div-box">
            <form onSubmit={editArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Edit Article </b> <br/>
                    User ID : {user?.nick_name} <br/>
                    <b> Category : </b>
                    {console.log(selected)}
                    <select onChange={handleSelect} value={selected}>
                        {categoryList?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input placeholder={"Title : " + articleDetail.title} onChange={editTitle}></input> <br/>
                    <textarea id="text-box" placeholder={"Content : " + articleDetail.content} onChange={editContent}></textarea> <br/>
                    <button type="submit" id="btn-post" style={{textAlign: "right"}}> Save </button>
                </div>
            </form>
            <button id="btn-remove" 
                        onClick={() => {window.location.href=`/board/${articleDetail?.id}`}}> Back </button>
        </div>
    )
}

export default ArticleEdit;