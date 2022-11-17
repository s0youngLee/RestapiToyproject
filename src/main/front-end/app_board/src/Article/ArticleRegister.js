import {useState, useCallback, useMemo} from 'react';
import {getUrlId, FetchWithoutId} from "../func";
import axios from "axios";
import _ from 'lodash';

function ArticleRegister(){
    const urlId = getUrlId(1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selected, setSelected] = useState(urlId);
    
    const formData = new FormData();
    const inputFile = document.getElementsByName("upfile");
    
    // const fileName = useMemo(() => {return new Array("Selected Files")},[]);
    const fileName = useMemo(() => {return new Array("파일 선택")},[]);
    const [files, setFiles] = useState({data : {}});

    const addTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const addContent = useCallback(e => {
        setContent(e.target.value);
    }, [])

    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const uploadFile = useCallback((e) => {        
        if(!_.isEmpty(inputFile[0].files)){
            fileName.length = 0;
            setFiles(inputFile[0].files);
            Array.from(inputFile[0].files).forEach(file => {
                fileName.push(" " + file.name);
            })
        }
        
    }, [inputFile, fileName]);
    
    for(let i = 0;i < files.length; i++){
        formData.append("file", files[i]);
    }
    
    const addArticle = (e) => {
        e.preventDefault();
        let data = {
            data: {
                title : title,
                content : content,
                created_id : sessionStorage.getItem("usercode"),
                category_id : selected
            }
        }
        formData.append("article", new Blob([JSON.stringify(data)], {type: "application/json"}));
    
        axios.post('/article/withfile', formData)
        .then((res) => {
            // alert("Article Registered.\nMove to selected category.");
            alert("게시글이 작성되었습니다.\n선택한 카테고리로 이동합니다.");
            window.location.href=`/board/category/${selected}`;
        }).catch((e) => {
            alert("게시글 등록을 실패하였습니다.\n다시 시도해주세요.");
        });
    }


    return(
        <form onSubmit={addArticle}>
            <div className="div-box" style={{height: "55vh"}}>
                <b style={{ fontSize: "30px"}}> Add Article </b> <hr/>
                <b style={{fontSize: "17px", justifyContent: "left"}}>User ID : {sessionStorage.getItem("username")} </b><br/>
                <b> Category : </b>
                <select onChange={handleSelect} value={selected}>
                    {Array.from(FetchWithoutId("category").data)?.map((category, index) => {
                        return <option key={index} value={category.id}>{category.name}</option>;
                    })}
                </select><br/>
                <input type={"text"} placeholder='Title' onChange={addTitle} required autoFocus></input> <br/>
                <textarea placeholder='Content' className="content-box" style={{height: "40%"}}
                          onChange={addContent} required></textarea> <br/>

                <input className="upload-name" value={fileName} disabled/>
                <label className="upload" htmlFor="file"> Upload </label> 
                <input type="file" name={"upfile"} id="file" style={{display:"none"}} onChange={uploadFile} multiple/><br/>
                
                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Add </button>
                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                        onClick={() => {window.location.href = "/board"}}> Back </button><br/>
            </div>
        </form>
    )
}

export default ArticleRegister;