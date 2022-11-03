import { Link } from "react-router-dom";

function MyComments({comments}){
    
    if(!comments){ return <div> Loading ... </div>}
    else {
        return (
            <>
                {comments?.map((comment, index) => {
                    return (
                    <Link key={index} className="none" to={`/board/${comment?.article_id}`}>
                        <li style={{textAlign: "left"}}>
                            <b>Content : </b> {comment?.content} &nbsp;&nbsp;
                            <b>Created At : </b> {comment?.created_at} &nbsp;&nbsp;<br/>
                            <b>In article "{comment?.article_title}" </b> &nbsp;&nbsp;
                        </li>
                    </Link> )
                })}
            </>
        )
    }
}

export default MyComments;