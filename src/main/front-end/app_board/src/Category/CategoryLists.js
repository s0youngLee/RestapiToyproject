import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import '../App.css'

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
        <>
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
                <Link to={`/category/add`} id="none"> <button id="btn-default"> Add Category </button></Link>
            </div>
        </>
    )
}

export default CategoryLists;