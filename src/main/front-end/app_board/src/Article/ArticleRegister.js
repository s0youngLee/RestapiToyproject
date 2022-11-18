import {useState, useCallback, useEffect, useMemo} from 'react';
import {getUrlId, FetchWithoutId} from "../func";
import axios from "axios";
import _ from 'lodash';

function ArticleRegister(){
    const urlId = getUrlId(1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selected, setSelected] = useState(urlId);

    const [categoryList, setCategoryList] = useState();
    const [categoryData, setCategoryData] = useState();
    
    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithoutId(categoryData, setCategoryData, "category");
        }else{
            setCategoryList(categoryData.data);
        }
    }, [categoryData]);
    
    const formData = new FormData();
    const inputFile = document.getElementsByName("upfile");
    
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
    
        axios.post('/article', formData)
        .then((res) => {
            alert("게시글이 작성되었습니다.\n선택한 카테고리로 이동합니다.");
            window.location.href=`/board/category/${selected}`;
        }).catch((e) => {
            alert("게시글 등록을 실패하였습니다.\n다시 시도해주세요.");
        });
    }

    if(_.isEmpty(categoryList)){return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Category Not Found</b> </div>}
    else{
        return(
            <form onSubmit={addArticle}>
                <div className="div-box" style={{height: "55vh"}}>
                    <b style={{ fontSize: "30px"}}> 게시물 작성 </b> <hr/>
                    <b> 카테고리 : </b>
                    <select onChange={handleSelect} value={selected}>
                        {Array.from(categoryList)?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input type={"text"} placeholder='Title' onChange={addTitle} required autoFocus></input> <br/>
                    <textarea placeholder='Content' className="content-box" style={{height: "40%"}}
                              onChange={addContent} required></textarea> <br/>
    
                    <input className="upload-name" value={fileName} disabled/>
                    <label className="upload" htmlFor="file"> 
                        <img src={require("../Icon/upload.png").default} alt={"icon"} style={{width: "20px", marginTop: "5px"}}/>
                    </label> 
                    <input type="file" name={"upfile"} id="file" style={{display:"none"}} onChange={uploadFile} multiple/><br/>
                    
                    <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > 글쓰기 </button>
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                            onClick={() => {window.location.href = "/board"}}> 돌아가기 </button><br/>
                </div>
            </form>
        )
    }
}

export default ArticleRegister;