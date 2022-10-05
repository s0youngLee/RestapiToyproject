import {useState, useCallback} from "react";
import * as Function from "../func";

function CommentEdit({data}){
    const [visible, setVisible] = useState(false);

    return  (
        <><button id="btn-post" onClick={() => {
            setVisible(!visible);
        }}> {visible ? "Cancel" : "Edit" } </button>
        {visible && <CommentEditForm data={data} />} </>
    )
}

function CommentEditForm({data}){
    const axios = require('axios');
    const [content, setContent] = useState(data?.content);
    
    const editcontent = useCallback( e => {
        setContent(e.target.value);
    }, [])

    const editComment = (e) => {
        console.log(Function.isEmpty(e.target.value));
        if(Function.isEmpty(e.target.value)){ setContent(data.content); }

        axios.put(`/comment/${data.id}`, {
            data : {
                content : content
            }
        })
        alert("comment edited.");
    }

    return (
        <><br/><br/>
        <form onSubmit={editComment}>
            <div id="div-box" style={{textAlign: "left"}}>
                <b style={{textAlign: "center"}}> Edit comment </b> <br/>
                <input  placeholder={data?.user_id} readOnly></input> <br/>
                <input  placeholder={data?.content} onChange={editcontent}></input> <br/>
                <button type="submit" id="btn-post" style={{textAlign: "right"}}
                     onClick={() => {window.location.href=`/board/${data?.article_id}`}}> Save </button>
            </div>
        </form></>
    )
}

export default CommentEdit;