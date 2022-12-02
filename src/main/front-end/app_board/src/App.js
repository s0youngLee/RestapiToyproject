import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
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
import UserManage from "./User/ManageUser";

import { isLogin, USER, Cookie } from "./func";
import './App.css';
import 'w3-css';
import axios from "axios";


function App() {
    const [cookies, ,removeCookies] = useCookies();
    
    useEffect(() => {
        Cookie(cookies, removeCookies);
    }, [cookies, removeCookies]);

    useEffect(() => {
        if(_.isEqual(USER.lastAccess, "true") && _.isEqual(localStorage.getItem("dateAlert"), "false")){
            if(window.confirm("비밀번호 변경을 추천합니다.\n확인을 누르면 마이페이지로 이동합니다.")){
                localStorage.setItem("dateAlert", true);
                window.location.replace("/mypage");
            }
        }
        if(!_.isEmpty(USER.auth)){
            if(!isLogin && _.isEqual(localStorage.getItem("dateAlert"), "true")){
                alert("로그인 정보가 만료되었습니다. 다시 로그인하세요.");
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    }, []);

    useEffect(() => {
        axios.get(`/pageview`).then((res) => {
            console.log(res.data);
        }).catch((e) => {
            console.log(e);
        })
    })
    
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />

                <Route exact path="/board" element={<Board  />} />
                <Route path="/board/:articleId" element={<ArticleDetail  />} /> 
                <Route path="/board/:categoryname/:categoryId" element={<ArticlesByCategory />} />
                <Route path="/board/add/:categoryId" element={<ArticleRegister />} />
                <Route path="/search/:keyword" element={<ArticleSearchList  />} />

                <Route exact path="/category" element={<CategoryDeatil />} />
                <Route path="/category/add/" element={<CategoryRegister />} />
                <Route path="/category/edit/:categoryId" element={<CategoryEdit />} />

                <Route exact path="/login" element={<LoginForm/>} />
                <Route path="/login/signup" element={<SignupForm />} />
                
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/user/manage" element={<UserManage />} />

                <Route exact path="*" element={<PageNotFound />} /> {/* No route match location Handle */} 
            </Routes>
        </Router>
    )
}

export default App;
