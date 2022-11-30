import { isLogin } from "../func";
import CommentData from "./CommentData";
import CommentRegister from "./CommentRegister";

function Comment({comments}){
    return (
        <div className="div-box" style={{textAlign: "left", marginTop: "0"}}>
            {isLogin && <CommentRegister />}
            <b style={{fontSize: "20px"}}>  &nbsp;&lt;댓글&gt; : {comments.length} 개</b>
            <div>{comments.map((comment, index)=>{
                return <CommentData key={index} data={comment}/>;
            })}</div>
        </div>
    ) 
}

export default Comment;