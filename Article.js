// Fast Campus

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { responseInterceptor } from "http-proxy-middleware";

function ArticleList(){
    const [articles, setArticles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchArticles = async () => {
        try{
            setArticles(null);
            setLoading(true);
            setError(null);
            const resposne = await axios.get("/board", {
                params:{
                    id: articles.id,
                    title: articles.title,
                    content: articles.content,
                    createdId: articles.createdId,
                    createdAt: articles.createdAt,
                    category_name: articles.category_name,
                    visitCnt: articles.visitCnt,
                    comment: {
                        id: articles.comment.id,
                        content: articles.comment.content,
                        createdAt: articles.comment.createdAt
                    }
                }
            });
            setArticles(resposne.data);
        }catch(e){
            setError(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    if(loading) return <div> loading... </div>
    if(error) return <div> ERROR </div>
    if(!articles) return null;

    return(
        <>
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        {article.id} ({article.title})
                    </li>
                ))}
            </ul>
            <button onClick={fetchArticles}> Reload </button>
        </>
    );
}

export default ArticleList;