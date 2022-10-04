// import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

function CategoryDeatil ({category}) {
    const categoryList = category;

    return (
        <div>
            {categoryList?.map((category, index) => {
                return <li key={index}><CategoryDeatilData data={category} /></li>
            })}
            <div style={{width: "100%", textAlign: "center", marginTop:"10px"}}>
                <Link to={`/`} id="none"> <button id="btn-default"> Home </button></Link>
                <Link to={`/category/add`} id="none"> <button id="btn-post"> Add Category </button></Link>
                
            </div>
        </div>
    )
}

function CategoryDeatilData({data}) {

    function deleteCategory(categoryId, categoryName) {
        const axios = require('axios');

        if(categoryId===0){
            alert("You cannot Remove DEFAULT category!!");
            return Error;
        }else{
            alert("Deleted Category " + categoryName + ", the articles are moved to DEFAULT category.");
            axios.delete(`/category/${categoryId}`);
            window.location.href="/board/category/0";
        }
    }

    return (
        <>
        <div>
            <b> ID : </b> <span> {data.id} </span><br/>
            <b> Name : </b><span> {data.name} </span><br/>
            <b> Article : {data.article_cnt} ea </b><br/>
        </div>
        <div>
            <Link to={`/board/category/${data.id}`}> <button id="btn-default"> Go to {data.name} </button></Link>
            <Link to={`/category/edit/${data.id}`} id="none"> <button id="btn-post"> Edit</button></Link>
            <button id="btn-remove" onClick={() => { deleteCategory(data.id, data.name) }}> 
                        Delete </button>
        </div>
        </>
    )
}

export default CategoryDeatil