import _ from 'lodash';
import ArticleList from '../Article/ArticleList';
import { FetchWithId } from "../func";


function ArticlesByCategory(){
    const category = FetchWithId("category", 1)?.data;
    const articleByCategory = Array.from(FetchWithId("article/category", 1)?.data);
    
    if(_.isEmpty(category)) { return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else {
    return (
        <div className='div-box'>
            <b style={{ fontSize: "30px"}}> Category : {category?.name} </b>
            <ArticleList articleList={articleByCategory} />
        </div>
    )}
}

export default ArticlesByCategory;