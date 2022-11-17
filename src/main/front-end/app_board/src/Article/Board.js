import _ from 'lodash';
import { FetchWithoutId } from '../func';
import ArticleList from './ArticleList';
import '../App.css'

function Board(){
    const article = FetchWithoutId("article").data;
    
    // function checkUserAccessDate(){
    //     if(!_.isEmpty(user)){
    //         const lastAccess = new Date(user.last_access);
    //         const today = new Date();
    
    //         const compare = today.getTime() - lastAccess.getTime();
    //         const checkDay = compare / (1000 * 60 * 60 * 24);
            
    //         if(checkDay > 7){
    //             if(window.confirm("Suggest to change your password.\nYour password wasn't changed from " + lastAccess.toISOString().substring(0,10) + ".")){
    //                 window.location.href = "/mypage";
    //             }
    //         }
    //         sessionStorage.setItem("dateAlert", true);
    //     }
    // }

    function suggestLogin(){
        // if(isLogin){
        //     window.location.href=`/board/add/0`;
        // }else{
        //     if(window.confirm("You should login to write an article.\nIf click confirm, redirect to login page.")){
        //         window.location.href=`/login`;
        //     }
        // }
    }
    
    if(_.isEmpty(article)){ return <div> Loading... </div> }
    else {
        return (
        <>
            {/* {!_.isEqual(sessionStorage.getItem("dateAlert"),"true") && checkUserAccessDate()} */}
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