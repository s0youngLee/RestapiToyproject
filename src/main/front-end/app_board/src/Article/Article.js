import { Link } from "react-router-dom";
import { isAdmin } from "../func";


function data({index, data, checkHandler}){
   return(
    <tr className="clickable" key={index}>
        {isAdmin() && 
            <td>
                <input  type={'checkbox'} onChange={(e) => {checkHandler(e, data.id);}}
                name="check" value={data.id}/>
            </td>
        }
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.id} </Link></td>
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.title} </Link></td>
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.category_name} </Link></td>
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.user_nickname} </Link></td>
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.created_at} </Link></td>
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.visit_cnt} </Link></td>
        <td><Link to={`/board/${data.id}`} className={"none"}> {data.comment_cnt} </Link></td>
    </tr>
   ) 
}

export default data;