import axios from "axios";
import { useState, useEffect } from "react";

export function isEmpty(value){
    if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
        return true;
    }else { return false; }
}

export function isLogin(member){
   if(member.data){ return true; }
   else { return false; }
}

export function getUrlId(){
    const urlList = ((window.location.href).split('/'));
    const id = urlList[(urlList.length)-1];
    return id;
}

export function FetchingArticle(articleId){
    const [articleDetail, setArticleDetail] = useState({
        data : {}
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(()=> {
        const RES = fetch(`/board/${articleId}`)
                    .then(res =>  res.json())
                    .then(result => {
                        setArticleDetail(result);
                        setLoading(false);
        });
    },[]);

    if(!loading) {return articleDetail;}
}

export function FetchingCategory(){
    const [categoryList, setCategoryList] = useState({  data : {}  });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get('/category').then((res) => {
            setCategoryList(res.data);
            setLoading(false)
        });
    }, [])

    if(!loading) {return categoryList.data;}
}