import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
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
    const user = sessionStorage.getItem("userinfo");
    const login = sessionStorage.getItem("login");

    useEffect(() => {
        axios.get("/loginstatus")
        .then((res) => {
            if(_.isEqual(res.data, true)){
                sessionStorage.setItem("login", true);
            }else{
                sessionStorage.setItem("login", false);
            }
        }).catch((e) => {
            console.log(e);
        })
    }, [user])

    useEffect(() => {
        if(_.isEqual(login, false)){
            if(_.isEqual(sessionStorage.getItem("dateAlert"), "true")){
                alert("로그인 정보가 만료되었습니다. 다시 로그인하세요.");
                sessionStorage.clear();
                window.location.href = "/login";
            }
        }
    }, [login, user]);
    
    return(
        <Router>
            <Bar isLogin={sessionStorage.getItem("login")}/>
            <Routes>
                <Route exact path="/" element={<Home />} />

                <Route exact path="/board" element={<Board  />} />
                <Route path="/board/:articleId" element={<ArticleDetail  />} /> 
                <Route path="/board/category/:categoryId" element={<ArticlesByCategory />} />
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
