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
        <div style={{textAlign: "center"}}>
            <form style={{textAlign: "center"}} onSubmit={editArticle}>
                <b style={{ fontSize: "40px"}}> Edit Article </b> <hr/>

                <div style={{width: "50%", margin: "auto", textAlign: "left"}}>
                    <b style={{fontSize: "20px", justifyContent: "left"}}>User ID : {user?.nick_name} </b><br/>
                    <b> Category : </b>
                    <select onChange={handleSelect} value={selected}>
                        {categoryList?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input placeholder={"Title : " + articleDetail.title} onChange={editTitle}></input> <br/>
                    <textarea id="text-box" placeholder={"Content : " + articleDetail.content} onChange={editContent}></textarea> <br/>
                </div>
                
                <button type="submit" id="btn-post" style={{textAlign: "right"}}> Save </button>
            </form>

            <button id="btn-remove"
                        onClick={() => {window.location.href=`/board/${articleDetail?.id}`}}> Back </button>
        </div>
    )
}

export default ArticleEdit;