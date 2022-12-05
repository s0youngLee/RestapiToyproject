import { useState, useEffect } from "react";
import axios from "axios";
import { FetchWithoutId, isAdmin, isLogin } from "./func";
import _ from "lodash";
import 'w3-css';

function Bar() {
    const [categoryData, setCategorydata] = useState();

    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithoutId(categoryData, setCategorydata, "category");
        }
    },[categoryData]);

    function myFunction() {
        var x = document.getElementById("demo");
        if (x.className.indexOf("w3-show") === -1) {
            x.className += " w3-show";
        } else { 
            x.className = x.className.replace(" w3-show", "");
        }
    }

    return ( 
        <>
        <div className="w3-top bar-top">
        <ul id="bar-ul" className="w3-navbar w3-large w3-left-align" style={{backgroundColor:"#cab6ff", padding: "0"}}>
            <li className="w3-hide-medium w3-hide-large w3-opennav w3-right">
                <button className="w3-bar-item w3-button w3-hover-deep-purple" onClick={() => myFunction()}>&#9776;</button>
            </li>
            <li> <button className="w3-bar-item w3-button w3-hover-deep-purple" onClick={() => window.location.href="/"}>홈</button> </li>
            <BarItems categoryData={categoryData}/>
        </ul>

            <div id="demo" className="w3-hide w3-hide-large w3-hide-medium">
                <ul className="w3-navbar w3-left-align w3-large" style={{backgroundColor: "#cab6ff"}}>
                    <BarHiddenItems categoryData={categoryData}/>
                </ul>
            </div>
        </div>
        </>
    );
}

function BarItems({categoryData}){
    return(
        <>
            <li  className="w3-hide-small" > <button  className="w3-bar-item w3-button w3-hover-deep-purple"
                    onClick={() => {window.location.href = '/board'}}>게시판</button> </li>
            <li className="w3-hide-small w3-dropdown-hover">
                <button className="w3-bar-item w3-button w3-hover-deep-purple" style={{marginLeft: "0"}}>카테고리</button>
                <div className="w3-dropdown-content w3-card-4">
                    {categoryData?.map((category, index) => (
                        <button key={index} className="w3-bar-item w3-button w3-hover-deep-purple" style={{backgroundColor: "aliceblue", textAlign: "left", fontSize: "13px", width: "100%"}}
                                onClick={() => window.location.href=`/board/${category.name}/${category.id}`}> {category.name} </button>
                    ))}
                </div>
            </li>
            {isAdmin() && <li  className="w3-hide-small">
                    <button className="w3-bar-item w3-button w3-hover-red" onClick={() => window.location.href="/category"}>카테고리 관리</button> </li>}

            {!isLogin && 
                <li className="w3-hide-small w3-right"><button className="w3-bar-item w3-button w3-hover-deep-purple"
                        onClick={() => window.location.href="/login/signup"}>회원가입</button></li>}
            {!isLogin && 
                <li className="w3-hide-small w3-right"><button className="w3-bar-item w3-button w3-hover-deep-purple"
                        onClick={() => window.location.href="/login"}>로그인</button></li>}
            {isLogin && 
                <li className="w3-hide-small w3-right"><button className="w3-bar-item w3-button w3-hover-deep-purple"
                        onClick={() => window.location.href="/mypage"}>내 정보</button></li>}
            {isLogin && <li className="w3-hide-small w3-right"><button className="w3-bar-item w3-button w3-hover-red"
                id="logout" onClick={() => Logout()}>로그아웃</button></li>}
        </>
    )
}

function BarHiddenItems({categoryData}){
    const [visible, setVisible] = useState(false);
    return(
        <>
            <li> <button className="w3-bar-item w3-button w3-hover-deep-purple"  style={{width: "100%", textAlign: "left"}}
                    onClick={() => {window.location.href = '/board'}}>게시판</button> </li>
            <li>
                <button className="w3-bar-item w3-button w3-hover-deep-purple" style={{width: "100%", textAlign: "left"}}
                        onClick={() => setVisible(!visible)}>카테고리</button><br/>
                {visible && <>
                    {categoryData?.map((category, index) => (
                        <><button key={index} className="w3-bar-item w3-button w3-hover-deep-purple" style={{width: "100%", textAlign: "left", fontSize: "13px"}}
                                onClick={() => window.location.href=`/board/${category.name}/${category.id}`}> {category.name} </button><br/></>
                    ))}
                    </>
                }
            </li>
            {isAdmin() && <li>
                    <button className="w3-bar-item w3-button w3-hover-red" style={{width: "100%", textAlign: "left"}}
                         onClick={() => window.location.href="/category"}>카테고리 관리</button><br/></li>}
            

            {!isLogin && 
                <li ><button className="w3-bar-item w3-button w3-hover-deep-purple" style={{width: "100%", textAlign: "left"}}
                        onClick={() => window.location.href="/login/signup"}>회원가입</button></li>}
            {!isLogin && 
                <li ><button className="w3-bar-item w3-button w3-hover-deep-purple" style={{width: "100%", textAlign: "left"}}
                        onClick={() => window.location.href="/login"}>로그인</button></li>}
            {isLogin && 
                <li ><button className="w3-bar-item w3-button w3-hover-deep-purple" style={{width: "100%", textAlign: "left"}}
                        onClick={() => window.location.href="/mypage"}>내 정보</button></li>}
            {isLogin && <li ><button className="w3-bar-item w3-button w3-hover-red" style={{width: "100%", textAlign: "left"}}
                id="logout" onClick={() => Logout()}>로그아웃</button></li>}
        </>
    )
}

export function Logout() {
    axios.post('/logout').catch((e) => {
        console.log(e);
    });
    alert("로그아웃되었습니다. 로그인 페이지로 이동합니다.");
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace('/login');
};

export default Bar;