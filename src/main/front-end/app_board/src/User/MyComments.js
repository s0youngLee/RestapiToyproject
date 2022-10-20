import { FetchWithoutId } from "../func";
import { Link } from "react-router-dom";

function MyComments(){
    const comments = Array.from(FetchWithoutId("comment/user"));
    if(!comments){ return <div> Loading ... </div>}
    else {
        return (
            <>
                <h2> Comments </h2>
                {comments?.map((comment, index) => {
                    return (
                    <Link key={index} id="none" to={`/board/${comment?.article_id}`}>
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