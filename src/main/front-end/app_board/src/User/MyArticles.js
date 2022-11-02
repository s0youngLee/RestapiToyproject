import { FetchWithoutId } from "../func";
import { Link } from "react-router-dom";

function MyArticles(){
    const articles = Array.from(FetchWithoutId("board/user"));
    if(!articles){ return <div> Loading... </div>}
    else {
        return (
            <>
                {articles?.map((article, index) => {
                    return (
                    <Link  key={index} className="none" to={`/board/${article.id}`}>
                        <li style={{textAlign: "left"}}>
                            <b>Title : </b> {article.title} &nbsp;&nbsp;
                            <b>Category : </b> {article.category_name} <br/>
                            <b>Created At : </b> {article.created_at} &nbsp;&nbsp;
                            <b>Visit : </b> {article.visit_cnt} <br/>
                            <b>Comment : </b> {article.comment_cnt} 
                        </li>
                    </Link> )
                })}
            </>
        )
    }
}

export default MyArticles;