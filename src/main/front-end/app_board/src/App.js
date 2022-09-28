import React, {Component} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ArticleLists from "./Article/ArticleLists";
import ArticleDetail from "./Article/ArticleDetail";
import ArticleEdit from "./Article/ArticleEdit";
import ArticleRegister from "./Article/ArticleRegister";
import CategoryLists from "./Category/CategoryLists";
import CategoryRegister from "./Category/CategoryRegister";
import CategoryEdit from "./Category/CategoryEdit";
import ArticlesByCategory from "./Category/ArticlesByCategory";
import './App.css';

class App extends Component{

    render(){
        return (
            <div><Router><Routes>
                <Route path="/" exact element={<Home/>} />
                <Route path="/board" element={<ArticleLists />} />
                <Route path="/category" element={<CategoryLists />} />
                <Route path="/board/:articleId" element={<ArticleDetail />} />
                <Route path="/category/board/:categoryId" element={<ArticlesByCategory />} />
                <Route path="/board/add/:categoryId" element={<ArticleRegister />} />
                <Route path="/board/:articleId/edit" element={<ArticleEdit />} />
                <Route path="/category/add/" element={<CategoryRegister />} />
                <Route path="/category/:categoryId/edit" element={<CategoryEdit />} />
            </Routes></Router></div>
        )
    }
}

export default App;