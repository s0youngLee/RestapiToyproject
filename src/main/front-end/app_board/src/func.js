import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

export function User(Login){
    const [user, setUser] = useState({ data : {} });
    useEffect(() => {
        if(Login){
            axios.get(`/user`)
            .then((res) => {
                setUser(res?.data)
            })
            .catch((e) => {
                ifError(e);
            });
        }
    }, [Login]);
    if(_.isEmpty(user)){ return <div> Loading ... </div> }
    else{ return user.data; }
}

export function canChange(user, id){
    return isAdmin(user?.auth) ||  _.isEqual(id, user?.nick_name);
}

export function isAdmin(auth){
    if(_.isEqual(auth, "ROLE_ADMIN")){
        return true;
    }else {
        return false;
    }
}

export function getUrlId(n){
    const urlList = ((window.location.href).split('/'));
    const id = urlList[(urlList.length)-n];
    return id;
}

export function FetchWithoutId(dataName){
    const [data, setData] = useState({ data : {} });
    useEffect(() => {
        axios.get(`/${dataName}`)
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
        axios.get(`/${dataName}/${id}`)
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
    if (window.confirm("Do you really want to delete?")){
        axios.delete(`/${dataName}/${dataId}`).then(() => {
            alert("Successfully deleted.");
            if(_.isEqual(dataName, "comment")){
                window.location.reload();
            }else {
                window.location.replace(`/${dataName}`);
            }
        }).catch((e) => {
            alert("Failed to delete.");
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
        window.URL.revokeObjectURL(downloadUrl);
    }).catch((e) => {
        console.log(e);
    })
    if(_.isEmpty(resource)){ return <div> Loading ... </div>}
    else{ return resource;} 
}



export function ifError(e){
    if(e.response.status === 400){
        alert("Bad Request");
        window.location.reload();
    }else if(e.response.status === 401){
        alert("Don't have permission.\nPlease Login.");
        window.location.replace("/login");
    }else if(e.response.status === 403){
        alert("Response rejected.");
        window.location.replace("/");
    }else if(e.response.status === 404){
        <div>
            <h1> SORRY <br/> Page Not Found </h1><hr/>
            <b>We can't found this page.</b>
            <Link className="none" to={`/`}><button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red">HOME</button></Link>
        </div>
    }else{
        alert("Error : " + e.response.status + " " + e.response.statusText + "\nReturn to Home.");
        window.location.href="/";
    }
}

export function autoHypenTel(str) {
    let phone = str.replace(/[^0-9]/g, '');
    // str = phone.replace(/[^0-9]/g, '');
    var tmp = '';
  
    if (_.isEqual(phone.substring(0, 2), "02")) {
      // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
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
      // 핸드폰 및 다른 지역 전화번호 일 경우
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