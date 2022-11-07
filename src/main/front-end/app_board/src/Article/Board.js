import { Link } from 'react-router-dom';
import ArticleList from './ArticleList';
import '../App.css'
import { FetchWithoutId } from '../func';
import _ from 'lodash';

function Board({user, isLogin}){
    const articleList = Array.from(FetchWithoutId("board").data);
    
    function checkUserAccessDate(){
        const lastAccess = new Date(user.last_access);
        const today = new Date((new Date().toISOString().substring(0,10)));

        const getMatch = today.getTime() - lastAccess.getTime();
        const checkDay = getMatch / (1000 * 60 * 60 * 24);
        console.log("user last logged in " + checkDay + "days ago.");

        if(checkDay > 7){
            if(window.confirm("Suggest to change your password.\nYour password wasn't changed from " + lastAccess.toISOString().substring(0,10) + ".")){
                window.location.href = "/mypage";
            }
        }
        sessionStorage.setItem("dateAlert", true);
    }
    
    if(_.isEmpty(articleList)){ return <div> Loading... </div> }
    else {
        return (
        <>
            {!sessionStorage.getItem("dateAlert") && checkUserAccessDate()}
            <div className='div-box'> 
                <b style={{ fontSize: "30px", margin : "10px"}}> Article List </b>
                {isLogin && 
                    <Link to={`/board/add/0`} className="none"> 
                        <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 
                                Write article </button></Link>}
                <ArticleList user={user} articleList={articleList}/>
            </div>
        </>
        )
    }
}

export default Board;