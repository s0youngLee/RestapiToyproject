import _ from 'lodash';
import { FetchWithoutId } from '../func';
import ArticleList from './ArticleList';
import '../App.css'

function Board(){
    const article = FetchWithoutId("article").data;
    
    function checkUserAccessDate(){
        if(!_.isEmpty(sessionStorage.getItem("username"))){
            const lastAccess = new Date(sessionStorage.getItem("lastAccess"));
            const today = new Date();
    
            const compare = today.getTime() - lastAccess.getTime();
            const checkDay = compare / (1000 * 60 * 60 * 24);
            
            if(checkDay > 7){
                // if(window.confirm("Suggest to change your password.\nYour password wasn't changed from " + lastAccess.toISOString().substring(0,10) + ".")){
                if(window.confirm("비밀번호를 변경을 추천합니다.\n마지막 로그인 : " + lastAccess.toISOString().substring(0,10) + ".")){
                    window.location.href = "/mypage";
                }
            }
            sessionStorage.setItem("dateAlert", true);
        }
    }

    function suggestLogin(){
        if(_.isEqual(sessionStorage.getItem("login"), "true")){
            window.location.href=`/board/add/0`;
        }else{
            // if(window.confirm("You should login to write an article.\nIf click confirm, redirect to login page.")){
            if(window.confirm("글을 작성하려면 로그인해야합니다.\n확인을 누르면 로그인 페이지로 이동합니다.")){
                window.location.href=`/login`;
            }
        }
    }
    
    if(_.isEmpty(article)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else {
        return (
        <>
            {!_.isEqual(sessionStorage.getItem("dateAlert"),"true") && checkUserAccessDate()}
            <div className='div-box'> 
                <b style={{ fontSize: "30px", margin : "10px"}}> Article List </b>
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        onClick={() => { suggestLogin() }}> Write article </button>
                <ArticleList articleList={Array.from(article)}/>
            </div>
        </>
        )
    }
}

export default Board;