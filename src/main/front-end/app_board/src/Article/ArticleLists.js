import {Link} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ArticleList from './ArticleList';
import CategoryBar from "../Category/CategoryBar";
import Bar from "../Bar";
import '../App.css'
import { FetchWithoutId } from '../func';

function ArticleLists({user, isLogin}){
    const articleList = Array.from(FetchWithoutId("board").data);
    const [, , removeCookie] = useCookies(['isLogin']);

    if(!articleList){ return <div> Loading... </div> }
    else {
        return (
            <>  {console.log()}
                <Bar isLogin={isLogin} removeCookie={removeCookie}/> 
                {isLogin && <CategoryBar user={user}/>}
                <ArticleList user={user} articleList={articleList} /><br/>

                <div style={{width: "100%", textAlign: "center"}}>
                    <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                    {isLogin && <Link to={`/board/add/0`} id="none"> <button id="btn-post"> Write </button></Link>}
                </div>
            </>
        )
    }
}

export default ArticleLists;