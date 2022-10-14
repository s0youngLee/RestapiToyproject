import CommentEdit from "./CommentEdit";
import CommentRegister from "./CommentRegister";
import axios from "axios";
import { isLogin, isAdmin, thisUser, User } from "../func";

function Comment({article}){
    const articleDetail = article;
    return (
        <div>
            {isLogin() && <CommentRegister />}
            <div>
                <b>&lt;Comment List&gt; : {articleDetail?.comment?.length} ea</b>
                <div>{articleDetail?.comment?.map((comment, index)=>{
                    return <CommentData key={index} data={comment}/>;
                })}</div>
            </div>
        </div>
    ) 
}


function CommentData({index, data}){
    const user = User();
    function deleteComment(articleId, commentId) {
        axios.delete(`/comment/${commentId}`)
        .then((res) => {
            alert("Comment Deleted");
            window.location.href = `/board/${articleId}`;
        }).catch((e) => {
            alert("Failed to delete comment.\nPlease try again.");
            window.location.href = `/board/${articleId}`;
        });
    }

    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data?.user_id} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span>
            
            {thisUser(data?.user_id) && 
                <CommentEdit data={data}/>}
            {(isAdmin(user?.auth) || thisUser(data?.user_id)) &&
                <button id="btn-remove" onClick={() => { deleteComment(data.article_id, data.id) }}>Delete</button>
            }
        </li> <br/></>
    );
}

export default Comment;