import React,{useState, useCallback} from "react";
import { getUrlId } from "../func";
import axios from "axios";

function CommentRegister({user}){
    const [content, setContent] = useState("");
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    const addComment = (e) => {        
        e.preventDefault();
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
        <form onSubmit={addComment} style={{marginLeft: "10px", height: "160px"}}>
            <b> Add Comment</b> <br/>
            <textarea className="text-box" placeholder="Add a comment" required
                        onChange={addContent}></textarea> 
            <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Add </button>
        </form>
    )
}

export default CommentRegister;