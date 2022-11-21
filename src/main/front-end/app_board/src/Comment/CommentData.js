import {useState, useCallback} from "react";
import _ from 'lodash';
import axios from "axios";
import {canRemove, Delete, isPublisher} from "../func";

function CommentData({index, data}){
    const [visible, setVisible] = useState(false);
    return(
        <><li className="filelist" key={index}>
            <span> <b> {data?.user_id} </b> / <span style={{color: "gray"}}> {data?.created_at} </span> </span><br/>
            <div className="info-box"> 
                <pre style={{marginBottom: "0"}}>{data?.content} </pre>
                {canRemove(data?.user_id) && 
                    <input type={"image"} src={require("../Icon/remove.png").default} alt={"icon"}
                        style={{float: "right", width:"20px"}}
                        onClick={() => {Delete("comment", data.id)}} /> 
                }
                {isPublisher(data.user_id) && 
                    <input type={"image"} src={require("../Icon/edit.png").default} alt={"icon"}
                        style={{width:"20px", float: "right", marginRight: "10px"}}
                        onClick={() => {setVisible(!visible)}} /> 
                }
            </div>
            
            {visible && <CommentEditForm data={data} visible={visible} setVisible={setVisible}/>} 
        </li> <br/></>
    );
}

function CommentEditForm({data, visible, setVisible}){
    const [content, setContent] = useState(data?.content);
    
    const editcontent = useCallback( e => {
        setContent(e.target.value);
    }, [])

    const editComment = (e) => {
        if(_.isEmpty(e.target.value)){ setContent(data.content); }

        axios.put(`/comment/${data.id}`, {
            content : content
        }).then(() => {
            alert("댓글이 수정되었습니다.");
            window.location.href=`/board/${data?.article_id}`;
        }).catch((e) => {
            alert("댓글 수정에 실패했습니다.");
            window.location.href=`/board/${data?.article_id}`;
            console.log(e.response);
        })
    }

    return (
        <form onSubmit={editComment} className="form-box">
            <b> Edit comment </b> <br/>
            <textarea style={{width:"100%", height: "50%", borderRadius: "5px"}} value={content} onChange={editcontent} /> <br/>
            <div style={{textAlign: "right", marginTop: "2px"}}>
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"
                        onClick={() => {setVisible(!visible)}}> Cancel </button>
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Save </button>
            </div>
        </form>
    )
}

export default CommentData;