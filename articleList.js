import React, { useEffect, useState } from "react";
import './App.css'

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
        setArticleList(props.ArticleLists);
        console.log(articleList);
        console.log(articleList.data[2]);
    },[props.ArticleLists, articleList])

    
    return (
        <div>
            Board Data(Text → JSON) :
            <Article list={articleList.data}/>
        </div>
    )
}

function Article({data}) {
    return (
      <ul id="ulNone" key={data}>
        {/* article만 불러오면 출력이 안됨, .data 또는 .id 등 붙이면 못읽음
            articleList에 값이 아직 없는 상태에서 출력하려고 하는 것 같음 */}
        {/* <li><b>ID : </b> <span key={data[0].id}>{data[0].id}</span> <br/></li> */}
        <li><b>ID : </b> <span key={data}>{data}</span> <br/></li>
        <li><b>Title : </b> <span>{data}</span> <br/></li>
        <li><b>Category : </b> <span>{data}</span> <br/></li>
        <li><b>Created By : </b> <span>{data}</span> <br/></li>
        <li><b>Created At : </b> <span>{data}</span> <br/></li>
        <li><b>Visit : </b> <span>{data}</span> <br/></li>
        <li><b>Comment : </b> <span>{data}</span> <br/></li>
      </ul>
    );
}

export default ArticleLists;
