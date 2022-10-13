import CommentEdit from "./CommentEdit";
import CommentRegister from "./CommentRegister";
import axios from "axios";

function Comment({article}){
    const articleDetail = article;

    return (
        <div>
            <CommentRegister />
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
    function deleteComment(articleId, commentId) {
        alert("Comment Deleted");
        axios.delete(`/comment/${commentId}`);
        window.location.href = `/board/${articleId}`;
    }

    return(
        <><li  key={index}>
            <b> User ID : </b> <span> {data?.user_id} </span> <br/>
            <b> Content : </b> <span> {data?.content} </span> <br/>
            <b> Created At : </b> <span> {data?.created_at} </span>
            
            <CommentEdit data={data}/>
            <button id="btn-remove" 
                    onClick={() => { deleteComment(data.article_id, data.id) }}>Delete</button>
        </li> <br/></>
    );
}

export default Comment;