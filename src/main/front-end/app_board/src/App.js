import React, {Component} from "react";
import ArticleLists from "./articleList";
import ArticleDetail from "./ArticleDetail";
import Home from "./Home";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {axios} from "axios";

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
                data:  {}
            }
    }

    componentDidMount() {
        this.callBoard();
    }


    callBoard = async () => {
        const RES = await fetch('/board')
                        .then((res) => res.json());
        return this.setState(this.state=RES);
    }


    render(){
        return (
            <div><Router><Routes>
                <Route path="/" exact element={<Home/>} />
                <Route path="/board" element={<ArticleLists ArticleLists={this.state} />} />
                <Route path="/board/:articleId" element={<ArticleDetail />} />
            </Routes></Router></div>
        )
    }
}

export default App;