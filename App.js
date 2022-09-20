import React, {Component} from "react";
import ArticleLists from "./articleList";
import './App.css';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
                data: [
                {
                    id: '',
                    title: '',
                    created_id: '',
                    created_at: '',
                    category_name: '',
                    visit_cnt: '',
                    comment_cnt: ''
                },
            ]
        }
    }

    componentDidMount() {
        this.callApi();
    }

    callApi = async () => {
        const RES = await fetch('/board')
                        .then((res) => res.json())
                        .then((result) => console.log(result))
        this.setState({data: RES});
    }

    render(){
        return(
            <div className="App">
                <ArticleLists ArticleLists={this.state.data}/>
            </div>
        );
    }
}

export default App;
