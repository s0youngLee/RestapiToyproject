import { Link } from "react-router-dom";
import _ from "lodash";

function MyArticles({articles}){
    if(_.isEmpty(articles)){ 
        return (
            <div>
                <b style={{fontSize: "25px"}}>작성한 게시글 없음</b>
            </div>
        );
    }else {
        return (
            <>
                {Array.from(articles)?.map((article, index) => {
                    return (
                    <Link  key={index} style={{textDecorationLine: "none", color: "inherit"}} to={`/board/${article.id}`}>
                        <li className="mypage-none" >
                            <b style={{fontSize: "20px"}}>{article.title}</b>
                            <span style={{color: "gray"}}> in <b style={{color: "black"}}>{article.category_name}</b> <br/>
                                최종 수정일 <b>{article.final_edit_date}</b><br/>
                                댓글 <b style={{color: "black"}}>{article.comment_cnt}</b> 개
                                조회수 <b style={{color: "black"}}>{article.visit_cnt}</b>
                            </span>
                        </li>
                    </Link> )
                })}
            </>
        )
    }
}

export default MyArticles;