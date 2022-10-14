import React,{useState, useCallback} from "react";
import { getUrlId, username, isEmpty } from "../func";
import axios from "axios";

function CommentRegister(){
    const [content, setContent] = useState("");
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    const addComment = (e) => {        
        if(isEmpty(content)){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post(`/comment`, {
            data: {
                user_id: username(),
                content: content,
                article_id: getUrlId(1)
            }
        }).then((res) => {
            alert("Comment Registered.");
            window.location.href=`/board/${getUrlId(1)}`;
        }).catch((e) => {
            alert("Failed to add comment.\nPlease try again.");
            window.location.replace(`/board/${getUrlId(1)}`);
        });
    }

    return(
        <form onSubmit={addComment}>
            <div style={{height: "160px"}}>
                <b> Add Comment</b> <br/>
                    User ID : {username()} <br/>
                <textarea id="text-box" placeholder="Add a comment"
                          onChange={addContent}></textarea> 
                <button type="submit" id="btn-post" > Add </button>
            </div>
            <br/>
        </form>
    )
}

export default CommentRegister;