import React, { useEffect, useState } from "react";
import './App.css'
import {Link} from 'react-router-dom';

function ArticleLists(props){
    const [articleList, setArticleList] = useState({
        data : {}
    });

    useEffect(()=> {
        const RES = fetch('/board')
                    .then((res) => res.json())
                    .then((result) => setArticleList(result));
    }, [articleList])

    const articleListArr = Array.from(articleList.data);

    return (
        <div>
            <table id="list">
                <thead>
                    <tr>
                        <th id="item"> ID </th>
                        <th id="item"> Title </th>
                        <th id="item"> Category </th>
                        <th id="item"> Created By </th>
                        <th id="item"> Created At </th>
                        <th id="item"> Visit </th>
                        <th id="item"> Comment </th>
                    </tr>
                </thead>
                <tbody>
                    {articleListArr.map((article, index) => (
                        <tr><Article data={article} index={index} /></tr>
                        ))}
                </tbody>
            </table>
            <br/>
            <div style={{width: "100%", textAlign: "center"}}><Link to={`/`} > <button id="btn-default"> Home </button></Link></div>
        </div>
    )
}


function Article({data, index}) {

    return (
        <>
            <td id="item"> {data.id} </td>
            <td id="item"> {data.title} </td>
            <td id="item"> {data.category_name} </td>
            <td id="item"> {data.created_id} </td>
            <td id="item"> {data.created_at} </td>
            <td id="item"> {data.visit_cnt} </td>
            <td id="item"> {data.comment_cnt} </td>
            <td id="item-detail"><Link to={`/board/${data.id}`}> <button id="btn-default"> Detail </button></Link></td>
        </>


        // <li id="liNone" key={index}>
        //     <b>ID : </b> <span>{data.id}</span> <br/>
        //     <b>Title : </b> <span>{data.title}</span> <br/>
        //     <b>Category : </b> <span>{data.category_name}</span> <br/>
        //     <b>Created By : </b> <span>{data.created_id}</span> <br/>
        //     <b>Created At : </b> <span>{data.created_at}</span> <br/>
        //     <b>Visit : </b> <span>{data.visit_cnt}</span> <br/>
        //     <b>Comment : </b> <span>{data.comment_cnt}</span> <br/>
        //     <nav>
        //         <Link to={`/`}>
        //             <button id="btn-default"> Home </button></Link>
        //         <Link to={`/board/${data.id}`}>
        //             <button id="btn-default"> Detail </button></Link>
        //     </nav>
        // </li>
    );
}

export default ArticleLists;


