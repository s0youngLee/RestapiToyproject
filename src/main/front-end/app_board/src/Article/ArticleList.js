import { useState } from "react";
import { isAdmin } from "../func";
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
    const articlesPerPage = articleList?.slice(offset, offset + articleCntPerPage);

    const checkedItemHandler = (id, isChecked) => {
        if(isChecked) {
            checkedItems.add(id);
            setCheckedItems(checkedItems);
        } else if (!isChecked && checkedItems.has(id)) {
            checkedItems.delete(id);
            setCheckedItems(checkedItems);
        }
        if(checkedItems.size === articleCntPerPage){
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
            // alert("Checked Items doesn't exist. \nPlease select article to delete.");
            alert("선택된 글이 없습니다. \n삭제하고자 하는 글을 선택해주세요.");
        // }else if (window.confirm("Do you really want to delete " + checkedItems.size + " articles?")){
        }else if (window.confirm(checkedItems.size + " 개의 글이 선택되었습니다.\n 삭제하시겠습니까?")){
            Array.from(checkedItems).map((id, index) => {
                return axios.delete(`/board/${id}`);
            });
            // alert("Successfully deleted.");
            alert("삭제되었습니다.");
            window.location.replace(`/board`);
        }
    }

    
    if(_.isEmpty(articleList)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div>}
    else{
        return(
            <>
            {isAdmin() && 
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                onClick={() => DeleteArticles()}>  Delete </button>}
            <SearchForm />
    
            <table>
                <thead style={{backgroundColor: "#bdb5f6"}}>
                <tr>
                    {isAdmin() && 
                        <th> <input type={'checkbox'} className="w3-check" checked={allChecked} 
                                    onChange={() => { 
                                        changeAll(!allChecked); }}/></th>
                    }
                    <th> ID </th>
                    <th> Title </th>
                    <th> Category </th>
                    <th> Created By </th>
                    <th> Created At </th>
                    <th> Visit </th>
                    <th> Comment </th>
                </tr>
                </thead>
                <tbody>
                    {articlesPerPage.map((article, index) => {
                       return (
                       <tr className="clickable" key={index} onClick={() => {window.location.href=`/board/${article.id}`}}>
                                {isAdmin() && 
                                    <td>
                                    <input  type={'checkbox'} onChange={(e) => {checkHandler(e, article.id);}}
                                    name="check" value={article.id}
                                    className="w3-check"/>
                                    </td>
                                }
                                <td> {article.id} </td>
                                <td> {article.title} </td>
                                <td> {article.category_name} </td>
                                <td> {article.user_nickname} </td>
                                <td> {article.created_at} </td>
                                <td> {article.visit_cnt} </td>
                                <td> {article.comment_cnt} </td>
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
                innerClass={""}
                activeClass={"w3-button w3-round-xxlarge w3-small w3-deep-purple"}
                itemClass={"w3-button w3-round-xxlarge w3-small w3-hover-deep-purple"}
                linkClass={"none"}
            />
            </>
        )
    }
}

export default ArticleList;