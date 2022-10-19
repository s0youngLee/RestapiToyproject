import Article from "./Article";
import { isAdmin } from "../func";
import "../App.css";


function ArticleList({user, articleList}){
    return(
        <table id="list">
            <thead style={{borderBottom: "2px solid #000000", backgroundColor: "#aa9dff"}}>
            <tr>
                <th id="item"> ID </th>
                <th id="item"> Title </th>
                <th id="item"> Category </th>
                <th id="item"> Created By </th>
                <th id="item"> Created At </th>
                <th id="item"> Visit </th>
                <th id="item"> Comment </th>
                {isAdmin(user?.auth) && <th id='item'> Del </th>}
            </tr>
            </thead>
            <tbody>
                {articleList?.map((article, index) => {
                    return <tr id="clickable" key={index} onClick={() => {window.location.href=`/board/${article.id}`}}>
                                <Article data={article} auth={user?.auth}/>
                            </tr>
                })}
            </tbody>
        </table>
    )
}

export default ArticleList;