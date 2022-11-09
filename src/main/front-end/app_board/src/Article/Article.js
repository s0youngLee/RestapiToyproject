import '../App.css'

function Article({data}) {
    return (
        <>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.id} </td>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.title} </td>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.category_name} </td>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.user_nickname} </td>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.created_at} </td>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.visit_cnt} </td>
            <td onClick={() => {window.location.href=`/board/${data.id}`}}> {data.comment_cnt} </td>
        </>
    );
}

export default Article;