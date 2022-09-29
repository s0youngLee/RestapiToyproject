import React, {useState, useEffect} from "react";
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
import './App.css';

// const isEmpty = function(value){
//     if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
//         return true;
//     }else { return false; }
// }

function App() {
    const [categoryList, setCategoryList] = useState({  data : {}  });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const res = fetch('/category')
                    .then((res) => res.json())
                    .then((result) => {
                        setCategoryList(result);
                        setLoading(false)
                    });
    }, [])
    

    if(loading) { return <h1> Loading ... </h1> }
    else {
        return(
            <div><Router><Routes>
                    <Route path="/" exact element={<Home/>} />
                    <Route path="/board" element={<ArticleLists category={categoryList.data}/>} />
                    <Route path="/board/:articleId" element={<ArticleDetail/>} /> 
                    <Route path="/board/category/:categoryId" element={<ArticlesByCategory category={categoryList.data}/>} />
                    <Route path="/board/add/:categoryId" element={<ArticleRegister />} />
                    <Route path="/board/:articleId/edit" element={<ArticleEdit/>} />
    
                    <Route path="/category" element={<CategoryDeatil category={categoryList.data}/>} />
                    <Route path="/category/add/" element={<CategoryRegister />} />
                    <Route path="/category/:categoryId/edit" element={<CategoryEdit />} />
            </Routes></Router></div>
        )
    }
}

export default App;