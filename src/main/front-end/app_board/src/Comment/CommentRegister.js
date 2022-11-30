import React,{useState, useCallback} from "react";
import { getUrlId, USER } from "../func";
import axios from "axios";

function CommentRegister(){
    const [content, setContent] = useState("");
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    const addComment = (e) => {        
        e.preventDefault();
        axios.post(`/comment`, {
            user_id: USER.nickname,
            content: content,
            article_id: getUrlId(1)
        }).then((res) => {
            alert("댓글이 등록되었습니다.");
            window.location.reload();
        }).catch((e) => {
            alert("댓글 등록에 실패했습니다.");
            window.location.reload();
        });
    }

    return(
        <form onSubmit={addComment} style={{marginLeft: "10px", height: "160px"}}>
            <b> 댓글 작성 </b> <br/>
            <textarea className="text-box" style={{width: "80%"}} placeholder="Add a comment" required
                      onChange={addContent}></textarea> 
            <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > 등록 </button>
        </form>
    )
}

export default CommentRegister;