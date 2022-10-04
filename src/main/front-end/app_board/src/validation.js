import { useState, useEffect } from "react";
import axios from "axios";

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

export function Fetching(articleId){
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