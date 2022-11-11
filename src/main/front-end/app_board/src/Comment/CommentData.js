import {useState, useCallback} from "react";
import _ from 'lodash';
import axios from "axios";
import {canChange, Delete} from "../func";

function CommentData({index, data, user}){
    const [visible, setVisible] = useState(false);
    return(
        <><li className="filelist" key={index}>
            <span> <b> {data?.user_id} </b> / <span style={{color: "gray"}}> {data?.created_at} </span> </span><br/>
            <div className="info-box"> 
                {data?.content} 
                {canChange(user, data?.user_id) && 
                    <input type={"image"} src={require("../Icon/remove.png").default} alt={"icon"}
                        style={{float: "right", width:"20px"}}
                        onClick={() => {Delete("comment", data.id)}} /> 
                }
                {_.isEqual(user?.nick_name, data?.user_id) && 
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
        <form onSubmit={editComment} className="div-box" style={{textAlign: "left", height: "10%", marginTop: "0", border: "1px solid mediumslateblue", borderRadius: "5px", padding: "10px", width: "80%"}}>
            <b style={{textAlign: "center", color: "mediumslateblue"}}> Edit comment </b> <br/>
            <input type={"text"} value={content} onChange={editcontent} style={{borderColor: "#b6a9ff"}}/>
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"
                    onClick={() => {setVisible(!visible)}}> Cancel </button>
            <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Save </button>
        </form>
    )
}

export default CommentData;