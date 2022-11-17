import CommentData from "./CommentData";
import CommentRegister from "./CommentRegister";

function Comment({article}){
    return (
        <div>
            {sessionStorage.getItem("login") && <CommentRegister />}
            <b style={{fontSize: "20px"}}>  &nbsp;&lt;Comment List&gt; : {article?.comment?.length} ea</b>
            <div>{article?.comment?.map((comment, index)=>{
                return <CommentData key={index} data={comment}/>;
            })}</div>
        </div>
    ) 
}

export default Comment;