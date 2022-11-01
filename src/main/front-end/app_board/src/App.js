import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { User } from "./func";
import Home from "./Home";
import Board from "./Article/Board";
import ArticleDetail from "./Article/ArticleDetail";
import ArticleRegister from "./Article/ArticleRegister";
import CategoryRegister from "./Category/CategoryRegister";
import CategoryEdit from "./Category/CategoryEdit";
import ArticlesByCategory from "./Category/ArticlesByCategory";
import ArticleSearchList from "./Article/ArticleSearchList";
import CategoryDeatil from "./Category/CategoryDetail";
import LoginForm from "./Login/LoginForm";
import SignupForm from "./Login/SignupForm";
import MyPage from "./User/Mypage";
import UserManage from "./User/ManageUser";
import './App.css';
import 'w3-css';
import Bar from "./Bar";

function App() {
    // const categoryList = Array.from(FetchWithoutId("category").data);
    const login = sessionStorage.getItem("isLogin");
    const user = User(login);

    return(
        <Router>
            <Bar isLogin={login} user={user}/>
                <Routes>
                <Route path="/" exact element={<Home isLogin={login}/>} />

                <Route path="/board" element={<Board user={user} isLogin={login}/>} />
                <Route path="/board/:articleId" element={<ArticleDetail user={user} isLogin={login}/>} /> 
                <Route path="/board/category/:categoryId" element={<ArticlesByCategory user={user} isLogin={login} />} />
                <Route path="/search/:keyword" element={<ArticleSearchList user={user} />} />
                <Route path="/board/add/:categoryId" element={<ArticleRegister user={user}/>} />

                <Route path="/category" element={<CategoryDeatil />} />
                <Route path="/category/add/" element={<CategoryRegister />} />
                <Route path="/category/edit/:categoryId" element={<CategoryEdit />} />

                <Route path="/login" element={<LoginForm/>} />
                <Route path="/login/signup" element={<SignupForm />} />
                
                <Route path="/mypage" element={<MyPage user={user}/>} />
                <Route path="/user" element={<UserManage />} />
            </Routes>
        </Router>
    )
}

export default App;
