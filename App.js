import React, {Component} from "react";
import ArticleLists from "./articleList";
import './App.css';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
                data:  {}
            }
    }

    componentDidMount() {
        this.callApi();
    }


    callApi = async () => {
        const RES = await fetch('/board')
                        .then((res) => res.json())
        return this.setState(this.state=RES);
    }

    render(){
        return(
            <div className="App">
               <ul id="ulNone"><ArticleLists ArticleLists={this.state} /></ul>
            </div>
        );
    }
}

export default App;
