import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
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
    const [user, setUser] = useState(undefined);

    const [login, setLogin] = useState();

    useEffect(() => {
        axios.get("/loginstatus")
        .then((res) => {
            setLogin(res.data);
        }).catch((e) => {
            console.log(e);
        })
    }, [])

    useEffect(() => {
        if(_.isEmpty(user) && login){
            axios.get("/user").then((res) => {
                if(!_.isEmpty(res.data)){
                    setUser(res.data.data);
                }else{
                    console.log("res.data empty");
                }
            }).catch((e) => {
                console.log(e);
            })
        }else if(!_.isEmpty(user) && !login){
            if(window.confirm("Session Expired. Move to login page?")){
                window.location.href = "/login";
            }else{
                window.location.reload();
            }
        }
    }, [login, user]);
    
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
