import axios from "axios";
import _ from "lodash";
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
        }else if(isNaN(id) && (!_.isEqual(id, sessionStorage.getItem('username')))){
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
                if(e.response.status === 400){
                    alert("Don't have permission.\nPlease Login.");
                    window.location.replace("/login");
                }else{
                    alert("Error : " + e.response.statusText + "\nReturn to Board.");
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
        alert("Failed to delete.\nError : " + e.response.statusText);
        window.location.replace(`/${dataName}/${dataId}`);
        // Comment : window.location.replace(`/${dataName}/${dataId-articleId}`); -- 보류
    });
}