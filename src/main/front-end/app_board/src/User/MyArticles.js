import { Link } from "react-router-dom";
import _ from "lodash";

function MyArticles({articles}){
    if(_.isEmpty(articles)){ 
        return (
            <div>
                <b style={{fontSize: "25px"}}>No Articles</b>
            </div>
        );
    }else {
        return (
            <>
                {Array.from(articles)?.map((article, index) => {
                    return (
                    <Link  key={index} style={{textDecorationLine: "none", color: "inherit"}} to={`/board/${article.id}`}>
                        <li className="mypage-none" >
                            <b style={{fontSize: "20px"}}>{article.title}</b><br/>
                            <span style={{color: "gray"}}>Posted in <b style={{color: "black"}}>{article.category_name}</b> / {article.created_at} </span><br/>
                            <span style={{color: "gray"}}> Last Edited on <b>{article.final_edit_date}</b></span><br/>
                            <span style={{color: "gray"}}> comment <b style={{color: "black"}}>{article.comment_cnt}</b> ea 
                            / visit <b style={{color: "black"}}>{article.visit_cnt}</b></span>
                        </li>
                    </Link> )
                })}
            </>
        )
    }
}

export default MyArticles;