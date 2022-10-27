import _ from 'lodash';
import { Link } from 'react-router-dom';
import ArticleList from '../Article/ArticleList';
import { FetchWithId, getUrlId } from "../func";


function ArticlesByCategory({user, isLogin}){
    const category = FetchWithId("category", 1).data;
    const articleByCategory = Array.from(FetchWithId("board/category", 1).data);
    
    if(_.isEmpty(articleByCategory)) { return <div> Loading ... </div> }
    else {
    return (
        <div className='div-box'>
            <b style={{ fontSize: "30px"}}> Category : {category?.name} </b>
            {isLogin && <Link to={`/board/add/${getUrlId(1)}`} className="none"> 
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Write article </button>
            </Link>}
            <ArticleList user={user} articleList={articleByCategory} />
        </div>
    )}
}

export default ArticlesByCategory;