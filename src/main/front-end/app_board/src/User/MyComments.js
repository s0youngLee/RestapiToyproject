import _ from "lodash";
import { Link } from "react-router-dom";

function MyComments({comments}){
    
    if(_.isEmpty(comments)){ return <div> Loading ... </div>}
    else {
        return (
            <>
                {comments?.map((comment, index) => {
                    return (
                    <Link  key={index} style={{textDecorationLine: "none", color: "inherit"}} to={`/board/${comment?.article_id}`}>
                        <li className="mypage-none">
                            <span style={{color: "gray"}}> In article <b style={{fontSize: "20px", color: "black"}}>{comment.article_title}</b> / </span>
                            <b style={{color: "gray"}}>{comment.created_at}</b><br/>
                            <span> {comment.content} </span>
                        </li>
                    </Link> )
                })}
            </>
        )
    }
}

export default MyComments;