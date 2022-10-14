import {Link} from 'react-router-dom';
import '../App.css'
// import { Delete, isAdmin, User } from '../func';

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
            {/* {isAdmin(User()?.auth) && 
                <input type={'checkbox'} style={{width: '20px', height: '20px', marginTop: "13px"}}
                       // 선택한 id값들 push 해서 저장해두기 
                />
                // <input type={"button"} id="btn-remove" style={{width: '20px', height: '20px'}} 
                //        onClick = {() => {Delete("board", data.id)}}/>
            } */}
        </>
    );
}

export default Article;