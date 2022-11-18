import { useState } from "react";
import { suggestLogin, isAdmin } from "../func";
import Pagination from "react-js-pagination";
import axios from "axios";
import "../App.css";
import SearchForm from "./SearchForm";
import _ from "lodash";


function ArticleList({articleList}){
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState(new Set());
    
    const pageLimit = 5; // page display cnt limit
    const articleCntPerPage = 10; // article cnt per pages
    const [currentPage, setCurrentPage] = useState(1);
    const offset = (currentPage - 1) * articleCntPerPage;
    const articlesPerPage = articleList.slice(offset, offset + articleCntPerPage);

    const checkedItemHandler = (id, isChecked) => {
        if(isChecked) {
            checkedItems.add(id);
            setCheckedItems(checkedItems);
        } else if (!isChecked && checkedItems.has(id)) {
            checkedItems.delete(id);
            setCheckedItems(checkedItems);
        }
        if(checkedItems.size === articlesPerPage.length){
            setAllChecked(true);
        }
    };

    const checkHandler = ({ target }, id) => {
        if(target.checked===false){
            setAllChecked(false)
        }
        checkedItemHandler(id, target.checked);
    };

    const changeAll = ((state) => {
        setAllChecked(state);
        for(var i = 0;i < articlesPerPage.length; i++){
            const item = document.getElementsByName("check")[i];
            item.checked = state;
            checkedItemHandler(Number(item.value), item.checked);
        }
    })

    const handlePageChange = (currentPage) => {
        setCurrentPage(currentPage);
        if(isAdmin()){
            checkedItems.clear();
            changeAll(false);
        }
    };

    function DeleteArticles(){
        if(checkedItems.size===0){
            alert("선택된 글이 없습니다. \n삭제하고자 하는 글을 선택해주세요.");
        }else if (window.confirm(checkedItems.size + " 개의 글이 선택되었습니다.\n삭제하시겠습니까?")){
            Array.from(checkedItems).map((id, index) => {
                return axios.delete(`/article/${id}`).catch((e) => {
                    console.log(e.response);
                });
            });
            alert("삭제되었습니다.");
            window.location.replace(`/board`);
        }
    }

    if(_.isEmpty(articleList)){ 
        return (
            <div style={{marginTop: "100px", textAlign: "center"}}> 
                <b style={{fontSize: "30px"}}>Data Not Found</b> <br/>
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        onClick={() => { suggestLogin() }}> Write article </button>
            </div>
        )
    }
    else{
        return(
            <div className="totalPage">
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                        onClick={() => { suggestLogin() }}> 글쓰기 </button>
                {isAdmin() && 
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                    onClick={() => DeleteArticles()}>  선택 삭제 </button>}
                <SearchForm />
        
                <table>
                    <thead style={{backgroundColor: "#bdb5f6"}}>
                    <tr>
                        {isAdmin() && 
                            <th> <input type={'checkbox'} checked={allChecked} 
                                        onChange={() => { changeAll(!allChecked); }}/></th>
                        }
                        <th> 번호 </th>
                        <th> 제목 </th>
                        <th> 카테고리 </th>
                        <th> 작성자 </th>
                        <th> 작성일 </th>
                        <th> 조회수 </th>
                        <th> 댓글수 </th>
                    </tr>
                    </thead>
                    <tbody>
                        {articlesPerPage.map((article, index) => {
                        return (
                        <tr className="clickable" key={index}>
                                {isAdmin() && 
                                    <td>
                                    <input  type={'checkbox'} onChange={(e) => {checkHandler(e, article.id);}}
                                    name="check" value={article.id}/>
                                    </td>
                                }
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.id} </td>
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.title} </td>
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.category_name} </td>
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.user_nickname} </td>
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.created_at} </td>
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.visit_cnt} </td>
                                <td onClick={() => {window.location.href=`/board/${article.id}`}}> {article.comment_cnt} </td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table> <hr/>
                <Pagination
                    activePage={currentPage} 
                    itemsCountPerPage={articleCntPerPage} 
                    totalItemsCount={articleList.length} 
                    pageRangeDisplayed={pageLimit} 
                    onChange={handlePageChange}
                    innerClass={"paginate"}
                    activeClass={"w3-button w3-round-xxlarge w3-small w3-deep-purple"}
                    itemClass={"w3-button w3-round-xxlarge w3-small w3-hover-deep-purple"}
                    linkClass={"none"}
                />
            </div>
        )
    }
}

export default ArticleList;