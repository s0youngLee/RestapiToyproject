import '../App.css'
import { Delete, isAdmin } from '../func';

function Article({data, auth}) {
    return (
        <>
            <td id="item"> {data.id} </td>
            <td id="item"> {data.title} </td>
            <td id="item"> {data.category_name} </td>
            <td id="item"> {data.created_id} </td>
            <td id="item"> {data.created_at} </td>
            <td id="item"> {data.visit_cnt} </td>
            <td id="item"> {data.comment_cnt} </td>
            {isAdmin(auth) && 
                // <input type={'checkbox'} style={{width: '20px', height: '20px', marginTop: "13px"}}
                //        // 선택한 id값들 push 해서 저장해두기 
                // />

                <td id="btn-remove" onClick = {() => {
                                window.event.cancelBubble = true;
                                Delete("board", data.id);
                            }}/>
            }
        </>
    );
}

export default Article;