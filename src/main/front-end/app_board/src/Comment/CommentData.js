import {useState, useCallback} from "react";
import _ from 'lodash';
import axios from "axios";
import {canChange, Delete} from "../func";

function CommentData({index, data, user}){
    const [visible, setVisible] = useState(false);
    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data?.user_id} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span>
            
            
            {_.isEqual(user.nick_name, data?.user_id) && 
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" 
                    onClick={() => setVisible(!visible)}> {visible ? "Cancel" : "Edit" } </button>
            }
            {canChange(user, data?.user_id) &&
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                    onClick={() => { Delete("comment", data.id) }}>Delete</button>
            }
            {visible && <CommentEditForm data={data}/>} 
        </li> <br/></>
    );
}

function CommentEditForm({data}){
    const [content, setContent] = useState(data?.content);
    
    const editcontent = useCallback( e => {
        setContent(e.target.value);
    }, [])

    const editComment = (e) => {
        if(_.isEmpty(e.target.value)){ setContent(data.content); }

        axios.put(`/comment/${data.id}`, {
            data : {
                content : content
            }
        }).then(() => {
            alert("comment edited.");
            window.location.href=`/board/${data?.article_id}`;
        }).catch((e) => {
            alert("Failed to edit comment.\nPlease try again.");
            window.location.href=`/board/${data?.article_id}`;
            console.log(e.response);
        })
    }

    return (
        <>
        <br/><br/>
        <form onSubmit={editComment}>
            <div className="div-box" style={{textAlign: "left"}}>
                <b style={{textAlign: "center"}}> Edit comment </b> <br/>
                <b> User ID : {data?.user_id}</b><br/>
                <input type={"text"} value={content} onChange={editcontent}></input>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Save </button>
            </div>
        </form></>
    )
}

export default CommentData;