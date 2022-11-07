import { Link } from "react-router-dom";

function MyArticles({articles}){
    if(!articles){ return <div> Loading... </div>}
    else {
        return (
            <>
                {articles?.map((article, index) => {
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