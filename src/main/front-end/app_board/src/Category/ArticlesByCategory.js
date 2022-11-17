import _ from 'lodash';
import { Link } from 'react-router-dom';
import ArticleList from '../Article/ArticleList';
import { FetchWithId, getUrlId } from "../func";


function ArticlesByCategory(){
    const category = FetchWithId("category", 1)?.data;
    const articleByCategory = Array.from(FetchWithId("article/category", 1)?.data);
    
    if(_.isEmpty(category)) { return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else {
    return (
        <div className='div-box'>
            <b style={{ fontSize: "30px"}}> Category : {category?.name} </b>
            {sessionStorage.getItem("login") && <Link to={`/board/add/${getUrlId(1)}`} className="none"> 
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Write article </button>
            </Link>}
            <ArticleList articleList={articleByCategory} />
        </div>
    )}
}

export default ArticlesByCategory;