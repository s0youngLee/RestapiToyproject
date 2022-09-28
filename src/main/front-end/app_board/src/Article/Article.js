import React from "react";
import {Link} from 'react-router-dom';
import '../App.css'

function Article({data}) {
    return (
        <>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.id} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.title} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.category_name} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.created_id} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.created_at} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.visit_cnt} </Link> </td>
            <td id="item"> <Link to={`/board/${data.id}`} id="none"> {data.comment_cnt} </Link> </td>
        </>
    );
}

export default Article;