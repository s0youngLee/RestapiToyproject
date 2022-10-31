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
        <form onSubmit={addComment}>
            <div style={{height: "160px"}}>
                <b> Add Comment</b> <br/>
                    User ID : {user?.nick_name} <br/>
                <textarea className="text-box" placeholder="Add a comment" required
                          onChange={addContent}></textarea> 
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Add </button>
            </div>
            <br/>
        </form>
    )
}

export default CommentRegister;