import { useState } from "react";
import Article from "./Article";
import { isAdmin } from "../func";
import Pagination from "react-js-pagination";
import axios from "axios";
import "../App.css";


function ArticleList({user, articleList}){
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
        if(isAdmin(user.auth)){
            checkedItems.clear();
            changeAll(false);
        }
    };

    function DeleteArticles(){
        if (window.confirm("Do you really want to delete " + checkedItems.size + " articles?")){
            Array.from(checkedItems).map((id, index) => {
                return axios.delete(`/board/${id}`);
            });
            alert("Successfully deleted.");
            window.location.replace(`/board`);
        }
    }
    
    return(
        <>
        {isAdmin(user.auth) && 
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                    onClick={() => DeleteArticles()}>  Delete </button>}

        <table>
            <thead style={{backgroundColor: "#bdb5f6"}}>
            <tr>
                {isAdmin(user.auth) && 
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
                    <tr className="clickable" key={index}>
                        {isAdmin(user.auth) && 
                            <input  type={'checkbox'} onChange={(e) => {checkHandler(e, article.id);}}
                            name="check" value={article.id}
                            className="w3-check"/>
                        }
                        <Article data={article} auth={user?.auth}/>
                    </tr>
                )})}
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

export default ArticleList;