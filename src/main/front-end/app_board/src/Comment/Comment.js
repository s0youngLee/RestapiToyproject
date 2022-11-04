import CommentData from "./CommentData";
import CommentRegister from "./CommentRegister";

function Comment({article, user, isLogin}){
    return (
        <div>
            {isLogin && <CommentRegister user={user}/>}
            <b style={{fontSize: "20px"}}>  &nbsp;&lt;Comment List&gt; : {article?.comment?.length} ea</b>
            <div>{article?.comment?.map((comment, index)=>{
                return <CommentData key={index} data={comment} user={user}/>;
            })}</div>
        </div>
    ) 
}

export default Comment;