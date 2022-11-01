import {Link} from 'react-router-dom';
import ArticleList from './ArticleList';
import '../App.css'
import { FetchWithoutId } from '../func';
import _ from 'lodash';

function Board({user, isLogin}){
    const article = FetchWithoutId("board");
    const articleList = Array.from(article.data);
    
    if(_.isEmpty(articleList)){ return <div> Loading... </div> }
    else {
        return (
            <div className='div-box'> 
                <b style={{ fontSize: "30px", margin : "10px"}}> Article List </b>
                {isLogin && 
                    <Link to={`/board/add/0`} className="none"> 
                        <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 
                                Write article </button></Link>}
                <ArticleList user={user} articleList={articleList}/>
            </div>
        )
    }
}

export default Board;