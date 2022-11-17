import React, { useState, useEffect } from "react";

import _ from "lodash";
import axios from "axios";

export const sliceArrayByLimit = (totalPage, limit) => {
    const totalPageArray = Array(totalPage)
      .fill()
      .map((_, i) => i);
    return Array(Math.ceil(totalPage / limit))
      .fill()
      .map(() => totalPageArray.splice(0, limit));
  };
  
export function isPublisher(publisher){
    return _.isEqual(publisher, sessionStorage.getItem("username"));
}
    
export function isAdmin(){
    return _.isEqual(sessionStorage.getItem("userauth"), "ROLE_ADMIN");
}

export function canRemove(publisher){
    return isAdmin() || isPublisher(publisher);
}

export function getUrlId(n){
    const urlList = ((window.location.href).split('/'));
    const id = urlList[(urlList.length)-n];
    return id;
}

export function FetchWithoutId(dataName){
    const [data, setData] = useState({ data : {} });
    useEffect(() => {
        axios.get(`/${dataName}`, { 
            headers : {
                "cache" : "no-store"
            }
         })
        .then((res) => {
            setData(res?.data);
        })
        .catch((e) => {
            ifError(e);
        });
    }, [dataName]);
    if(_.isEmpty(data)){ return <div> Loading ... </div> }
    else{ return data; }
}

export function FetchWithId(dataName, n){
    const [data, setData] = useState({ data : {} });
    const id = getUrlId(n);
    useEffect(() => {
        axios.get(`/${dataName}/${id}`, { 
            headers : {
                "cache" : "no-store"
            }
        })
        .then((res) => {
            setData(res?.data);
        })
        .catch((e) => {
            ifError(e);
        });
    }, [dataName, id]);
    if(_.isEmpty(data)){ return <div> Loading ... </div>}
    else{ return data;} 
}

export function Delete(dataName, dataId){
    if (window.confirm("삭제하시겠습니까?")){
        axios.delete(`/${dataName}/${dataId}`).then(() => {
            alert("삭제되었습니다.");
            if(_.isEqual(dataName, "comment") || _.isEqual(dataName, "user")){
                window.location.reload();
            }else if(_.isEqual(dataName, "article")){
                window.location.replace(`/board`);
            }else{
                window.location.replace(`/${dataName}`);
            }
        }).catch((e) => {
            alert("삭제에 실패했습니다.");
            window.location.reload();
        });
    }
}

export function Download(resource, dataname, id, filename){
    axios.get(`/${dataname}/${id}`, {responseType: "blob"})
    .then((res)=>{
        resource = res.data;
        const downloadUrl = window.URL.createObjectURL(resource);
        const anchor = document.createElement('a');

        document.body.appendChild(anchor);
        anchor.download = filename;
        anchor.href = downloadUrl;
        anchor.click();

        document.body.removeChild(anchor);
    }).catch((e) => {
        console.log(e);
    })
    if(_.isEmpty(resource)){ return <div> Loading ... </div>}
    else{ return resource;} 
}



export function ifError(e){
    if(e.response.status === 400){
        alert("잘못된 접근입니다.\n홈으로 이동합니다.");
        window.location.replace("/");
    }else if(e.response.status === 401){
        alert("권한이 없습니다.\n로그인 페이지로 이동합니다.");
        window.location.replace("/login");
    }else if(e.response.status === 403){
        alert("응답이 거부되었습니다.\n홈으로 이동합니다.");
        window.location.replace("/");
    }else{
        alert("Error : " + e.response.status + " " + e.response.statusText + "\n홈으로 이동합니다.");
        window.location.href="/";
    }
}

export function autoHypenTel(str) {
    let phone = str.replace(/[^0-9]/g, '');
    let tmp = '';
  
    if (_.isEqual(phone.substring(0, 2), "02")) {
        if (phone.length < 3) {
            return str;
        } else if (phone.length < 6) {
            tmp += phone.substr(0, 2);
            tmp += '-';
            tmp += phone.substr(2);
            return tmp;
        } else if (phone.length < 10) {
            tmp += phone.substr(0, 2);
            tmp += '-';
            tmp += phone.substr(2, 3);
            tmp += '-';
            tmp += phone.substr(5);
            return tmp;
        } else {
            tmp += phone.substr(0, 2);
            tmp += '-';
            tmp += phone.substr(2, 4);
            tmp += '-';
            tmp += phone.substr(6, 4);
            return tmp;
        }
    } else {
        if (phone.length < 4) {
            return str;
        } else if (phone.length < 7) {
            tmp += phone.substr(0, 3);
            tmp += '-';
            tmp += phone.substr(3);
            return tmp;
        } else if (phone.length < 11) {
            tmp += phone.substr(0, 3);
            tmp += '-';
            tmp += phone.substr(3, 3);
            tmp += '-';
            tmp += phone.substr(6);
            return tmp;
        } else {
            tmp += phone.substr(0, 3);
            tmp += '-';
            tmp += phone.substr(3, 4);
            tmp += '-';
            tmp += phone.substr(7);
            return tmp;
        }
    }   
}