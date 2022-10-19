import React,{useState, useCallback} from "react";
import { getUrlId } from "../func";
import _ from 'lodash';
import axios from "axios";

function CommentRegister({user}){
    const [content, setContent] = useState("");
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    const addComment = (e) => {        
        if(_.isEmpty(content)){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post(`/comment`, {
            data: {
                user_id: user?.nick_name,
                content: content,
                article_id: getUrlId(1)
            }
        }).then((res) => {
            alert("Comment Registered.");
            window.location.reload();
        }).catch((e) => {
            alert("Failed to add comment.\nPlease try again.");
            window.location.reload();
        });
    }

    return(
        <form onSubmit={addComment}>
            <div style={{height: "160px"}}>
                <b> Add Comment</b> <br/>
                    User ID : {user?.nick_name} <br/>
                <textarea id="text-box" placeholder="Add a comment"
                          onChange={addContent}></textarea> 
                <button type="submit" id="btn-post" > Add </button>
            </div>
            <br/>
        </form>
    )
}

export default CommentRegister;