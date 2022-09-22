import React, {Component} from "react";
import ArticleLists from "./articleList";
import ArticleDetail from "./ArticleDetail";
import Home from "./Home";
import './App.css';
import { Route, Routes } from "react-router-dom";

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
            <div><Routes>
                <Route path="/" exact element={<Home/>} />
                <Route path="/board" element={<ArticleLists ArticleLists={this.state} />} />
                <Route path="/board/:articleId" element={<ArticleDetail />} />
            </Routes></div>
        )
    }
}

export default App;
