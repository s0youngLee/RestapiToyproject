import { useState } from "react";
import Article from "./Article";
import { isAdmin, Delete } from "../func";
import "../App.css";

function ArticleList({user, articleList}){
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState(new Set());

    const checkedItemHandler = (id, isChecked) => {
        if(isChecked) {
            checkedItems.add(id);
            setCheckedItems(checkedItems);
        } else if (!isChecked && checkedItems.has(id)) {
            checkedItems.delete(id);
            setCheckedItems(checkedItems);
        }
    };

    const checkHandler = ({ target }, id) => {
        if(target.checked===false){setAllChecked(false)}
        checkedItemHandler(id, target.checked);
    };

    const changeAll = (() => {
        setAllChecked(!allChecked);
        for(var i = 0;i < Array.from(articleList).length; i++){
            const item = document.getElementsByName("check")[i];
            item.checked = !allChecked;
            checkedItemHandler(Number(item.value), item.checked);
        }
    })

    
    return(
        <>
        {isAdmin(user.auth) && 
            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                    onClick={() => Array.from(checkedItems).map((id, index) => {
                                return Delete("board", id);
                            })}>  Delete </button>}

        <table id="list">
            <thead style={{borderBottom: "2px solid #000000", backgroundColor: "#aa9dff"}}>
            <tr>
                {isAdmin(user.auth) && 
                    <th> <input type={'checkbox'} style={{width: "20px", height: "20px"}}
                                checked={allChecked} onChange={() => changeAll()}/></th>
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
                {articleList?.map((article, index) => {
                   return (
                    <tr id="clickable" key={index}>
                        {isAdmin(user.auth) && 
                            <input  type={'checkbox'} onChange={(e) => {checkHandler(e, article.id);}}
                            name="check" value={article.id}
                            style={{width: "20px", height: "20px", margin: "11px"}}/>
                        }
                        <Article data={article} auth={user?.auth}/>
                    </tr>
                )})}
            </tbody>
        </table>
        </>
    )
}

export default ArticleList;