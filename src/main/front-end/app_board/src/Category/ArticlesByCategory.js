import {Link} from 'react-router-dom';
import Article from "../Article/Article";
import * as Function from "../func";


function ArticlesByCategory(){
    const category = Function.Fetching("category", 1);
    const articleByCategory = Function.Fetching("board/category", 1);
    
    if(!articleByCategory) { return <div> Loading ... </div> }
    else {
    return (
        <div>
            <div>
                <h1 style={{color: "#373737", textAlign:"center"}}> Category : {category?.name} </h1> 
            </div>
            <table id="list">
                <thead>
                    <tr>
                        <th id="item"> ID </th>
                        <th id="item"> Title </th>
                        <th id="item"> Category </th>
                        <th id="item"> Created By </th>
                        <th id="item"> Created At </th>
                        <th id="item"> Visit </th> 
                        <th id="item"> Comment </th>
                    </tr>
                </thead>
                <tbody>
                    {articleByCategory?.map((article, index) => (
                        <tr key={index}><Article data={article} /></tr>
                        ))}
                </tbody>
            </table>
            <br/>
            <div style={{width: "100%", textAlign: "center"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/board`} id="none"><button id="btn-default"> Board </button></Link>
                <Link to={`/board/add/${Function.getUrlId(1)}`} id="none"> <button id="btn-post"> Write </button></Link> 
                <br/>
            </div>
        </div>
    )}
}

export default ArticlesByCategory;