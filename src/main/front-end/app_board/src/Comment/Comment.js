import _ from "lodash";
import CommentData from "./CommentData";
import CommentRegister from "./CommentRegister";

function Comment({comments}){
    return (
        <div className="div-box" style={{textAlign: "left", marginTop: "0"}}>
            {console.log(sessionStorage.getItem("login"))}
            {_.isEqual(sessionStorage.getItem("login"), "true") && <CommentRegister />}
            <b style={{fontSize: "20px"}}>  &nbsp;&lt;Comment List&gt; : {comments.length} ea</b>
            <div>{comments.map((comment, index)=>{
                return <CommentData key={index} data={comment}/>;
            })}</div>
        </div>
    ) 
}

export default Comment;