import axios from "axios";
import _ from "lodash";
import { useState, useEffect } from "react";

export function username(){
    return sessionStorage.getItem('username');
}

export function User(){
    if(isLogin()){
        return Fetching("user", username());
    }else{
        return null;
    }
}

export function isEmpty(value){
    if(value === "" || value === null || value === undefined || ( value !== null && typeof value === "object" && !Object.keys(value).length)){
        return true;
    }else { return false; }
}

export function isLogin(){
   if(sessionStorage.getItem('username')){ return true; }
   else { return false; }
}

export function isAdmin(auth){
    if(_.isEqual(auth, "ROLE_ADMIN")){
        return true;
    }else {
        return false;
    }
}

export function thisUser(createdId){
    return isLogin() && _.isEqual(createdId, username());
}


export function getUrlId(n){
    const urlList = ((window.location.href).split('/'));
    const id = urlList[(urlList.length)-n];
    return id;
}

export function Fetching(dataName, n){
    const id = getUrlId(n);
    const [data, setData] = useState({ data : {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(_.isEqual(dataName, "board/category") && (Number(id)===0)){
            axios.get('/board/category/0').then((res) => {
                setData(res?.data);
                setLoading(false);
            }).catch((e) => {
                alert("Error : " + e.response.statusText + "\nReturn to Board.");
                window.location.replace("/board");
            });
        }else if(_.isEqual(n, sessionStorage.getItem('username'))){
            axios.get(`/${dataName}/${n}`).then((res) => {
                setData(res?.data);
                setLoading(false);
            }).catch((e) => {
                alert("Error : " + e.response.statusText + "\nReturn to Board.");
                window.location.replace("/board");
            })
        }else if(isNaN(id)){
            axios.get(`/${dataName}`).then((res) => {
                setData(res?.data);
                setLoading(false);
            }).catch((e) => {
                alert("Error : " + e.response.statusText + "\nReturn to Board.");
                window.location.replace("/board");
            });
        }else{
            axios.get(`/${dataName}/${id}`).then((res) => {
                setData(res?.data);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
                if(e.response.status === 400){
                    alert("Don't have permission.\nPlease Login.");
                    window.location.replace("/login");
                }else{
                    alert("Error : " + e.response.status + " " + e.response.statusText + "\nReturn to Board.");
                    window.location.replace("/board");
                }
            });
        }
    }, []);
    if(!loading) { return data.data; }
}

export function Delete(dataName, dataId){
    axios.delete(`/${dataName}/${dataId}`).then(() => {
        alert("Successfully deleted.");
        window.location.replace(`/${dataName}`);
         // Comment : window.location.replace(`/${dataName}/${dataId}`); -- 보류
    }).catch((e) => {
        alert("Failed to delete.");
        window.location.replace(`/${dataName}/${dataId}`);
        // Comment : window.location.replace(`/${dataName}/${dataId-articleId}`); -- 보류
    });
}