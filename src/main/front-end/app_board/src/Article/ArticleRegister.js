import {useState, useCallback} from 'react';
import {getUrlId, FetchWithoutId} from "../func";
import axios from "axios";
import _ from 'lodash';

function ArticleRegister({user}){
    const urlId = getUrlId(1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selected, setSelected] = useState(urlId);

    const addTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const addArticle = (e) => {
        e.preventDefault();
        if(_.isEmpty(title)){
            alert("You must input title!!!");
            return Error;
        }else{setTitle(title);}

        if(_.isEmpty(content)){
            alert("You must input content!!!");
            return Error;
        }else{setContent(content);}

        axios.post('/board', {
            data : {
                title : title,
                content : content,
                created_id : user?.nick_name,
                category_id : selected
            }
        }).then((res) => {
            alert("Article Registered.\nMove to selected category.");
            window.location.href=`/board/category/${selected}`;
        }).catch((e) => {
            alert("Failed to register an article.\nPlease try again.");
            window.location.replace(`/board/add/${urlId}`);
        });
    }

    return(
        <div style={{textAlign: "center"}}>
            <br/><br/>
            <form onSubmit={addArticle}>
                <div id="div-box">
                    <b style={{textAlign: "center"}}> Add Article </b> <br/>
                    User ID : {user?.nick_name} <br/>
                    <b> Category : </b>
                    <select onChange={handleSelect} value={selected}>
                        {Array.from(FetchWithoutId("category").data)?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input placeholder="Title" onChange={addTitle}></input> <br/>
                    <textarea id="text-box" placeholder="Content" onChange={addContent}></textarea> <br/>
                    <button type="submit" id="btn-post"> Add </button>
                </div>
            </form>
            <button style={{textAlign: "center"}} id='btn-default' 
                    onClick={() => {window.location.href = `/`}}> Home </button>
        </div>
    )
}

export default ArticleRegister;