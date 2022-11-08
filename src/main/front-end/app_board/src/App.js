import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { User, ifError } from "./func";
import _ from "lodash";

import Home from "./Home";
import Bar from "./Bar";

import Board from "./Article/Board";
import ArticleDetail from "./Article/ArticleDetail";
import ArticleRegister from "./Article/ArticleRegister";
import ArticleSearchList from "./Article/ArticleSearchList";

import CategoryRegister from "./Category/CategoryRegister";
import CategoryEdit from "./Category/CategoryEdit";
import ArticlesByCategory from "./Category/ArticlesByCategory";
import CategoryDeatil from "./Category/CategoryDetail";

import LoginForm from "./Login/LoginForm";
import SignupForm from "./Login/SignupForm";

import MyPage from "./User/Mypage";
import PageNotFound from "./PageNotFound";

import './App.css';
import 'w3-css';
import UserManage from "./User/ManageUser";
import axios from "axios";

function App() {
    const login = sessionStorage.getItem("isLogin");
    const user = User(login);
    
    useEffect(() => {
        if(!_.isEmpty(sessionStorage.getItem("loginTime"))){
            const loginTime = sessionStorage.getItem("loginTime");
            const time = new Date(loginTime);
            const compare = ((new Date().getTime()) -time.getTime())/(1000 * 60);

            // ****수정 및 보완 매우 필요****
            // java session timeout == 20m , react 에서는 17m 지났을 때 미리 알림 창 띄움
            if(compare > 17){ 
                axios.put("/user/lastaccess")
                .then(() => {
                    if(window.confirm("Session timeout. Do you want to extend your session?")){
                        // 알림창을 띄운 지 3분 이상 지난 경우(20분이 된 경우) confirm 되더라도 로그아웃(session이 이미 만료된 상태라 연장 불가)
                        if(((new Date().getTime()) -time.getTime())/(1000 * 60) >= 20){ 
                            // 이 경우 사용자는 세션 연장을 원했지만 이미 세션이 만료된 상태일 것이므로 바로 로그인 페이지로 이동
                            sessionStorage.clear();
                            alert("Session Expired. Please re-login");
                            window.location.replace("/login");
                        }else{
                            sessionStorage.setItem("loginTime", new Date());
                            window.location.reload();
                        }
                    }else{
                        // session 연장을 선택하지 않은 경우 바로 로그아웃 처리 후 홈으로 이동
                        sessionStorage.clear();
                        axios.post('/logout');
                        alert("Logout Success. Move to board");
                        window.location.replace('/');
                    }
                })
                .catch((e) => {
                    ifError(e);
                })
            }
            console.log(compare);
        }
    }, []);
    


    return(
        <Router>
            <Bar isLogin={login} user={user}/>
            <Routes>
                <Route path="/" exact element={<Home isLogin={login}/>} />

                <Route exact path="/board" element={<Board user={user} isLogin={login}/>} />
                <Route path="/board/:articleId" element={<ArticleDetail user={user} isLogin={login}/>} /> 
                <Route path="/board/category/:categoryId" element={<ArticlesByCategory user={user} isLogin={login} />} />
                <Route path="/board/add/:categoryId" element={<ArticleRegister user={user}/>} />
                <Route path="/search/:keyword" element={<ArticleSearchList user={user} />} />

                <Route exact path="/category" element={<CategoryDeatil />} />
                <Route path="/category/add/" element={<CategoryRegister />} />
                <Route path="/category/edit/:categoryId" element={<CategoryEdit />} />

                <Route exact path="/login" element={<LoginForm/>} />
                <Route path="/login/signup" element={<SignupForm />} />
                
                <Route path="/mypage" element={<MyPage user={user}/>} />
                <Route path="/user/manage" element={<UserManage />} />

                <Route path="*" element={<PageNotFound />} /> {/* No route match location Handle */}
            </Routes>
        </Router>
    )
}

export default App;
