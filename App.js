import React, {Component} from "react";
import ArticleLists from "./articleList";
import './App.css';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
                data:  {}
                // {
                //     id: '',
                //     title: '',
                //     created_id: '',
                //     created_at: '',
                //     category_name: '',
                //     visit_cnt: '',
                //     comment_cnt: ''
                // },
            }
    }

    componentDidMount() {
        this.callApi();
    }


    callApi = async () => {
        const RES = await fetch('/board')
                        .then((res) => res.json())

        // this.setState(this.state=RES);
        // console.log(this.state);
        return this.setState(this.state=RES);
    }

    render(){
        return(
            <div className="App">
                {/* <p>{this.state}</p> */}
                <ArticleLists ArticleLists={this.state} />
            </div>
        );
    }
}

export default App;
