import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

export function IsLogin(cookie){
    if (_.isEqual(cookie.isLogin, "true")){ 
        return true;
    }
    else{ 
        return false; 
    }
}

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
    if(!user){ return <div> Loading ... </div> }
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
            setData(res?.data)
        })
        .catch((e) => {
            ifError(e);
        });
    }, [dataName]);
    if(!data){ return <div> Loading ... </div> }
    else{ return data; }
}

export function FetchWithId(dataName, n){
    const [data, setData] = useState({ data : {} });
    const id = getUrlId(n);
    useEffect( () => {
        axios.get(`/${dataName}/${id}`)
        .then((res) => {
            setData(res?.data);
        })
        .catch((e) => {
            ifError(e);
        });
    }, [dataName, id]);
    if(!data){ return <div> Loading ... </div>}
    else{ return data.data;}
}

export function Delete(dataName, dataId){
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
            <Link id="none" to={`/`}><button id="btn-remove">HOME</button></Link>
        </div>
    }else{
        alert("Error : " + e.response.status + " " + e.response.statusText + "\nReturn to Home.");
        window.location.replace("/");
    }
}