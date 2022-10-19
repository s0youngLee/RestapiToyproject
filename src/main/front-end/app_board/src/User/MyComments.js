import { FetchWithoutId } from "../func";
import { Link } from "react-router-dom";

function MyComments(){
    const comments = Array.from(FetchWithoutId("user/comment"));
    if(!comments){ return <div> Loading ... </div>}
    else {
        return (
            <div>
                {comments?.map((comment, index) => {
                    return (
                    <Link key={index} id="none" to={`/board/${comment?.article_id}`}>
                        <li>
                            <b>Article ID : </b> {comment?.article_id} &nbsp;&nbsp;
                            <b>Content : </b> {comment?.content} &nbsp;&nbsp;
                            <b>Created At : </b> {comment?.created_at} &nbsp;
                        </li>
                    </Link> )
                })}
            </div>
        )
    }
}

export default MyComments;