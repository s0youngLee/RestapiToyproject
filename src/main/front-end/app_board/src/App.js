import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { IsLogin, User } from "./func";
import { useCookies } from "react-cookie";
import Home from "./Home";
import ArticleLists from "./Article/ArticleLists";
import ArticleDetail from "./Article/ArticleDetail";
import ArticleEdit from "./Article/ArticleEdit";
import ArticleRegister from "./Article/ArticleRegister";
import CategoryRegister from "./Category/CategoryRegister";
import CategoryEdit from "./Category/CategoryEdit";
import ArticlesByCategory from "./Category/ArticlesByCategory";
import CategoryDeatil from "./Category/CategoryDetail";
import LoginForm from "./Login/LoginForm";
import SignupForm from "./Login/SignupForm";
import MyPage from "./User/Mypage";
import UserManage from "./User/ManageUser";
import './App.css';

export function Login() {
    const [cookie, , ] = useCookies(['isLogin']);
    let isLogin = IsLogin(cookie);
    return isLogin;
}

function App() {
    const login = Login();
    const user = User(login);

    return(
        <Router><Routes>
                <Route path="/" exact element={<Home isLogin={login}/>} />

                <Route path="/board" element={<ArticleLists user={user} isLogin={login}/>} />
                <Route path="/board/:articleId" element={<ArticleDetail user={user} isLogin={login}/>} /> 
                <Route path="/board/category/:categoryId" element={<ArticlesByCategory user={user} />} />
                <Route path="/board/add/:categoryId" element={<ArticleRegister user={user}/>} />
                <Route path="/board/edit/:articleId" element={<ArticleEdit user={user}/>} />

                <Route path="/category" element={<CategoryDeatil />} />
                <Route path="/category/add/" element={<CategoryRegister />} />
                <Route path="/category/edit/:categoryId" element={<CategoryEdit />} />

                <Route path="/login" element={<LoginForm/>} />
                <Route path="/login/signup" element={<SignupForm />} />
                
                <Route path="/mypage" element={<MyPage user={user}/>} />
                <Route path="/user/manage" element={<UserManage />} />
        </Routes></Router>
    )
}

export default App;
