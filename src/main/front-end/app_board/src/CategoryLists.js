import React, { useEffect, useState, useCallback } from "react";
import './App.css'
import {Link} from 'react-router-dom';

function CategoryLists(){
    const [cateogoryList, setCategoryList] = useState({
        data : {}
    });

    useEffect(()=> {
        const RES = fetch('/category')
                    .then((res) => res.json())
                    .then((result) => setCategoryList(result));
    }, [])


    const categoryListArr = Array.from(cateogoryList.data);

    return (
        <div>
            <h1 style={{color: "#373737", textAlign:"center"}}> Category List </h1> 
            <div style={{margin: "10px"}}>
                {categoryListArr.map((category, index) => (
                    <Link to={`/category/board/${category.id}`} id="none" key={index}> 
                        <button id="btn-category"> {category.name} </button>
                    </Link>
                ))}
            </div>
            <div style={{width: "100%", textAlign: "center", marginTop:"10px"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/`} id="none"> <button id="btn-default"> Add Category </button></Link>
            </div>
            <CategoryRegister />
        </div>
    )
}

function CategoryRegister(){
    const axios = require('axios');
    
    const [id, setId] = useState("");
    const [name, setName] = useState("");

    const addId = useCallback(e => {
        setId(e.target.value);
    }, [])

    const addName = useCallback(e => {
        setName(e.target.value);
    }, [])
    
    
    const addCategory = (e) => {
        if(id === (null || "")){
            alert("You must input your ID!!!");
            return Error;
        }else{setId(id);}

        if(name === (null || "")){
            alert("You must input Name!!!");
            return Error;
        }else{setName(name);}

        axios.post('/category', {
            data : {
                id : id,
                name : name
            }
        });
        
        alert("Category registerd");
    }

    return(
        <div>
            <br/><br/><br/>
            <form onSubmit={addCategory}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Category </b> <br/>
                    <input id="id-box" placeholder="Category ID" onChange={addId}></input> <br/>
                    <input id="id-box" placeholder="Category Name" onChange={addName}></input> <br/>
                    <button type="submit" id="btn-add" style={{textAlign: "right"}}
                            onClick={() => {window.location.href=`/category/board/${id}`}}> Add </button>
                </div>
            </form>
        </div>
    )
}

export default CategoryLists;