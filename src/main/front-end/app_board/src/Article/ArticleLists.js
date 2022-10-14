import {Link} from 'react-router-dom';
import Article from "../Article/Article";
import CategoryBar from "../Category/CategoryBar";
import Bar from "../Bar";
import '../App.css'
import {useState, useEffect} from 'react';
import axios from 'axios';
import { Fetching, isAdmin, isLogin, username } from '../func';

function ArticleLists(){
    const [articleList, setArticleList] = useState({
        data : {}
    });
    let user = "";
    if(isLogin()){
        user = Fetching("user", username());
    }

    useEffect(()=> {
        axios.get('/board')
            .then((res) => {
                setArticleList(res?.data);
            });
    }, [])

    const articleListArr = Array.from(articleList?.data);
    if(!articleListArr){ return <div> Loading... </div> }
    else {
        return (
            <>  
                <Bar /> 
                {isLogin() && <CategoryBar/>}
                <table id="list">
                    <thead style={{borderBottom: "2px solid #000000", backgroundColor: "#aa9dff"}}>
                        <tr>
                            <th id="item"> ID </th>
                            <th id="item"> Title </th>
                            <th id="item"> Category </th>
                            <th id="item"> Created By </th>
                            <th id="item"> Created At </th>
                            <th id="item"> Visit </th>
                            <th id="item"> Comment </th>
                            {isAdmin(user?.auth) && <th id='item'> Del </th>}
                        </tr>
                    </thead>
                    <tbody>
                        {articleListArr.map((article, index) => {
                            return <tr key={index}><Article data={article}/></tr>
                        })}
                    </tbody>
                </table>
                <br/>
                <div style={{width: "100%", textAlign: "center"}}>
                    <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                    {isLogin() && <Link to={`/board/add/0`} id="none"> <button id="btn-post"> Write </button></Link>}
                </div>
            </>
        )
    }
}

export default ArticleLists;