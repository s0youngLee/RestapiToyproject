import {Link} from 'react-router-dom';
import Comment from "../Comment/Comment";
import { isLogin, Fetching, Delete, thisUser, isAdmin, User } from '../func';

function ArticleDeatil(){
    const articleDetail = Fetching("board", 1);
    if(!articleDetail) { return <div> Loading .. </div>}
    else { return <ArticleDetailData data={articleDetail}/>; }
}

function ArticleDetailData({data}) {
    let user = User();
    return (
        <div style={{marginLeft: "10px"}}>
            <div style={{padding: "10px", overflow: "auto"}}>
                <div style={{float: "left", width: "500px", marginRight: "20px"}}>
                    <h1>Article Detail</h1> <br/>
                    <b> ID : </b> <span> {data?.id} </span> <br/>
                    <b> Title : </b> <span> {data?.title} </span> <br/>
                    <b> Category : </b> <span> {data?.category_name} </span> <br/>
                    <b> Content : </b> <span> {data?.content} </span> <br/>
                    <b> Created By : </b> <span> {data?.created_id} </span> <br/>
                    <b> Created At : </b> <span> {data?.created_at} </span> <br/>
                    <b> Visit : </b> <span> {data?.visit_cnt} </span> 
                    <div style={{float: "right"}}>
                    {thisUser(data?.created_id) &&
                        <Link to={`/board/edit/${data?.id}`} id="none" >
                            <button style={{float: "right"}} id="btn-post"> Edit </button></Link>}
                    {(isAdmin(user?.auth) || thisUser(data?.created_id)) &&
                        <button id="btn-remove" onClick={() => { Delete("board", data.id) }}>Delete</button>}
                    </div>
                    <br/> <br/>
                    <div style={{float: "right"}}>
                        <Link to={`/`} id="none">
                                <button id="btn-default"> Home </button></Link>
                        <Link to={`/board`} id="none">
                                <button id="btn-default"> Board </button></Link>
                        {isLogin() && <Link to={`/board/category/${data?.category_id}`} id="none">
                            <button id="btn-default"> {data?.category_name} List </button></Link>}
                    </div>
                </div>
            </div><hr/>
            <Comment article={data}/>
        </div>
    );
}

export default ArticleDeatil;