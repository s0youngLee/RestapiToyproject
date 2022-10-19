import CommentEdit from "./CommentEdit";
import CommentRegister from "./CommentRegister";
import { Delete, canChange } from "../func";
import _ from "lodash";

function Comment({article, user, isLogin}){
    return (
        <div>
            {isLogin && <CommentRegister user={user}/>}
            <div>
                <b>&lt;Comment List&gt; : {article?.comment?.length} ea</b>
                <div>{article?.comment?.map((comment, index)=>{
                    return <CommentData key={index} data={comment} user={user}/>;
                })}</div>
            </div>
        </div>
    ) 
}


function CommentData({index, data, user}){
    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data?.user_id} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span>
            
            { _.isEqual(data?.user_id, user?.nick_name) && 
                <CommentEdit data={data}/>}
            {canChange(user, data?.user_id) &&
                <button id="btn-remove" onClick={() => { Delete("comment", data.id) }}>Delete</button>
            }
        </li> <br/></>
    );
}

export default Comment;