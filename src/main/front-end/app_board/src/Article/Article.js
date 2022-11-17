// import '../App.css'
// import {isAdmin } from "../func";

// function Article({data, index, user}) {
//     return (
//         <>
//         <tr className="clickable" key={index} onClick={() => {window.location.href=`/board/${data.id}`}}>
//             {isAdmin(user) && 
//                 <td>
//                 <input  type={'checkbox'} onChange={(e) => {checkHandler(e, data.id);}}
//                 name="check" value={data.id}
//                 className="w3-check"/>
//                 </td>
//             }
//             <td> {data.id} </td>
//             <td> {data.title} </td>
//             <td> {data.category_name} </td>
//             <td> {data.user_nickname} </td>
//             <td> {data.created_at} </td>
//             <td> {data.visit_cnt} </td>
//             <td> {data.comment_cnt} </td>
//         </tr>
//         </>
//     );
// }

// export default Article;