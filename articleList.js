import React from "react";
import './App.css'

function Article({ data }) {
    return (
      <div>
        <b>ID : </b> <span>({data.id})</span> <br/>
        <b>Title : </b> <span>({data.title})</span> <br/>
        <b>Category : </b> <span>({data.category_name})</span> <br/>
        <b>Created By : </b> <span>({data.created_id})</span> <br/>
        <b>Created At : </b> <span>({data.created_at})</span> <br/>
        <b>Visit : </b> <span>({data.visit_cnt})</span> <br/>
        <b>Comment : </b> <span>({data.comment_cnt})</span> <br/>
      </div>
    );
  }


function ArticleLists({props}){
    // const articleList = props.data;
    // const articles = data && data.map((article, index) => {
    //     return <div key={index}>
    //                 <span>{article[0]}</span>
    //                 <br/>
    //            </div>
    // });


    return (
        <div>
            Board Data(Text → JSON) :
            <div>
                {props.data.map(article => (
                    <Article article={article} /> 
                ))}
            </div>
            {/* <div id="article"> {articles} </div> */}
        </div>
    )
}

export default ArticleLists;