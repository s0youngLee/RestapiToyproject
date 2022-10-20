import {Link} from 'react-router-dom';
import ArticleList from './ArticleList';
import '../App.css'
import { FetchWithoutId } from '../func';

function ArticleLists({user, isLogin}){
    const articleList = Array.from(FetchWithoutId("board").data);
    if(!articleList){ return <div> Loading... </div> }
    else {
        return (
            <> <b style={{ fontSize: "30px", margin : "10px"}}> Article List </b>
            {isLogin && <Link to={`/board/add/0`} id="none"> <button id="btn-post"> Write article </button></Link>}
            <ArticleList user={user} articleList={articleList} /><hr/>
            {/* 페이징 처리 추가 */}
            </>
        )
    }
}

export default ArticleLists;