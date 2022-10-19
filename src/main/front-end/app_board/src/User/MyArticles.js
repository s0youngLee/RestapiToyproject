import { FetchWithoutId } from "../func";
import { Link } from "react-router-dom";

function MyArticles(){
    const articles = Array.from(FetchWithoutId("user/article"));
    if(!articles){ return <div> Loading... </div>}
    else {
        return (
            <div>
                {articles?.map((article, index) => {
                    return (
                    <Link  key={index} id="none" to={`/board/${article.id}`}>
                        <li>
                            <b>Title : </b> {article.title} &nbsp;&nbsp;
                            <b>Category : </b> {article.category_name} &nbsp;&nbsp;
                            <b>Created At : </b> {article.created_at} &nbsp;&nbsp;
                            <b>Visit : </b> {article.visit_cnt} &nbsp;&nbsp;
                            <b>Comment : </b> {article.comment_cnt} &nbsp;
                        </li>
                    </Link> )
                })}
            </div>
        )
    }
}

export default MyArticles;