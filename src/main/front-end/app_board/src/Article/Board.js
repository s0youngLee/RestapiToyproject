import _ from 'lodash';
import axios from 'axios';
import { FetchWithoutId } from '../func';
import { Logout } from '../Bar';
import ArticleList from './ArticleList';
import '../App.css'

function Board({user, isLogin}){
    const articleList = Array.from(FetchWithoutId("board").data);
    
    function checkUserAccessDate(){
        const lastAccess = new Date(user.last_access);
        const today = new Date();

        const compare = today.getTime() - lastAccess.getTime();
        const checkDay = compare / (1000 * 60 * 60 * 24);
        
        if(checkDay > 7){
            if(window.confirm("Suggest to change your password.\nYour password wasn't changed from " + lastAccess.toISOString().substring(0,10) + ".")){
                window.location.href = "/mypage";
            }
        }
        sessionStorage.setItem("dateAlert", true);
    }

    function suggestLogin(){
        if(isLogin){
            window.location.href=`/board/add/0`;
        }else{
            if(window.confirm("You should login to write an article.\nIf click confirm, redirect to login page.")){
                window.location.href=`/login`;
            }
        }
    }

    function LastAccess(){
        axios.get("/session-info")
        .then((res) => {
            console.log("LOCAL TIME : " + new Date());
            console.log("LASTACCESS : " + new Date(res.data));
            console.log("Compare : " + ((new Date().getTime()) - Number(res.data))/(1000));
            if((new Date().getTime() - Number(res.data))/(1000) > 30){
                if(window.confirm("Do you want to extends your login?\nElse you'll be logoout.")){
                    if((new Date().getTime() - Number(res.data))/1000 > 50){
                        alert("Session Expired. Please login again");
                        sessionStorage.clear();
                        window.location.replace("/login");
                    }else{
                        window.location.reload();
                    }
                }else{
                    alert("Session Expired. Please login again");
                    Logout();
                    window.location.replace("/login");
                }
            }
        }).catch((e) => {
            console.log(e.response);
        });
    }
    
    if(_.isEmpty(articleList)){ return <div> Loading... </div> }
    else {
        return (
        <>
            {!_.isEqual(sessionStorage.getItem("dateAlert"),"true") && checkUserAccessDate()}
            <div className='div-box'> 
                <b style={{ fontSize: "30px", margin : "10px"}}> Article List </b>
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        onClick={() => { suggestLogin() }}> Write article </button>
                <ArticleList user={user} articleList={articleList}/>
            </div>
            <button onClick={() => { LastAccess() }}> session info </button>
        </>
        )
    }
}

export default Board;