import { Link } from 'react-router-dom';
import ArticleList from '../Article/ArticleList';
import { FetchWithId, getUrlId } from "../func";


function ArticlesByCategory({user}){
    const category = FetchWithId("category", 1);
    const articleByCategory = Array.from(FetchWithId("board/category", 1));
    
    if(!articleByCategory) { return <div> Loading ... </div> }
    else {
    return (
        <div>
            <div>
                <h1 style={{color: "#373737", textAlign:"center"}}> Category : {category?.name} </h1> 
            </div>
            <ArticleList user={user} articleList={articleByCategory} />
            
            <br/>
            <div style={{width: "100%", textAlign: "center"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/board`} id="none"><button id="btn-default"> Board </button></Link>
                <Link to={`/board/add/${getUrlId(1)}`} id="none"> <button id="btn-post"> Write </button></Link> 
                <br/>
            </div>
        </div>
    )}
}

export default ArticlesByCategory;