import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ArticleLists from "./Article/ArticleLists";
import ArticleDetail from "./Article/ArticleDetail";
import ArticleEdit from "./Article/ArticleEdit";
import ArticleRegister from "./Article/ArticleRegister";
import CategoryRegister from "./Category/CategoryRegister";
import CategoryEdit from "./Category/CategoryEdit";
import ArticlesByCategory from "./Category/ArticlesByCategory";
import CategoryDeatil from "./Category/CategoryDetail";
import LoginForm from "./User/LoginForm";
import SignupForm from "./User/SignupForm";
import MyPage from "./User/Mypage";
import './App.css';


function App() {
    return(
        <Router><Routes>
                <Route path="/" exact element={<Home />} />

                <Route path="/board" element={<ArticleLists />} />
                <Route path="/board/:articleId" element={<ArticleDetail/>} /> 
                <Route path="/board/category/:categoryId" element={<ArticlesByCategory />} />
                <Route path="/board/add/:categoryId" element={<ArticleRegister />} />
                <Route path="/board/edit/:articleId" element={<ArticleEdit />} />

                <Route path="/category" element={<CategoryDeatil />} />
                <Route path="/category/add/" element={<CategoryRegister />} />
                <Route path="/category/edit/:categoryId" element={<CategoryEdit />} />

                <Route path="/login" element={<LoginForm/>} />
                <Route path="/login/signup" element={<SignupForm />} />
                <Route path="/mypage/:username" element={<MyPage/>} />
        </Routes></Router>
    )
}

export default App;