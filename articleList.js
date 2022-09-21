import React, { useEffect, useState } from "react";
import './App.css'

function Article({article}) {
    return (
      <div>
        {/* article만 불러오면 출력이 안됨, .data 또는 .id 등 붙이면 못읽음
            articleList에 값이 아직 없는 상태에서 출력하려고 하는 것 같음 */}
        {/* <b>ID : </b> <span>{article.data(0).id}</span> <br/> */}
        <b>ID : </b> <span>{article}</span> <br/>
        <b>Title : </b> <span>{article}</span> <br/>
        <b>Category : </b> <span>{article}</span> <br/>
        <b>Created By : </b> <span>{article}</span> <br/>
        <b>Created At : </b> <span>{article}</span> <br/>
        <b>Visit : </b> <span>{article}</span> <br/>
        <b>Comment : </b> <span>{article}</span> <br/>
      </div>
    );
}


function ArticleLists(props){
    const [articleList, setArticleList] = useState({
        data : 
            {
                id: 'DEFAULT',
                title: 'DEFAULT',
                created_id: 'DEFAULT',
                created_at: 'DEFAULT',
                category_name: 'DEFAULT',
                visit_cnt: 'DEFAULT',
                comment_cnt: 'DEFAULT'
            }
    });
    
    useEffect(()=> {
        // let resData = null;
        // async function fetchData() {
        //     resData = await props.ArticleLists;
        // }
        // fetchData();
        setArticleList(props.ArticleLists);
        console.log(articleList);
    },[props.ArticleLists, articleList])

    
    return (
        <div>
            Board Data(Text → JSON) :
            <Article list={articleList}/>
        </div>
    )
}

export default ArticleLists;
