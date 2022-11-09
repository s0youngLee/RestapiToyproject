import {useState, useCallback, useMemo, useEffect} from "react";
import { FetchWithoutId } from "../func";
import axios from "axios";
import _ from "lodash";

function ArticleEditForm({user, articleDetail, handleClose}){
    const categoryList = Array.from(FetchWithoutId("category").data);

    const [title, setTitle] = useState(articleDetail.title);
    const [content, setContent] = useState(articleDetail.content);
    const [selected, setSelected] = useState(articleDetail.category_id);

    const formData = new FormData();
    const inputFile = document.getElementsByName("upfile");
    const fileName = useMemo(() => {return new Array("Selected Files")},[]);
    const [files, setFiles] = useState({data : {}});
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        // 이부분 아래 겹치는 거 덜어내든지 다시 구조 짜기
        if(!_.isEmpty(articleDetail.files)){
            setVisible(true);
            Array.from(articleDetail.files).forEach(file => {
                const name = file.origin_name.split(".");
                const fileType = name[name.length-1];
                
                if(isImage(fileType)){
                    axios.get(`/download/${file.id}`, {responseType: "blob"})
                    .then((res)=>{
                        const image = document.createElement('img');
                        image.setAttribute("name", "preview-infile");
                        image.className = "image-preview-infile";
                        image.setAttribute("alt", file.name);
                        image.src = URL.createObjectURL(res.data);
                        image.title = file.origin_name;
                        document.getElementById('preview-img').appendChild(image);
                    });
                }else {
                    const br = document.createElement('br');
                    br.setAttribute("name", "br");

                    const doc = document.createElement('span');
                    doc.setAttribute("name", "preview-infile");
                    doc.className = "application-preview-infile";
                    doc.textContent = file.origin_name;
                    
                    document.getElementById('preview-file').appendChild(doc);
                    document.getElementById('preview-file').appendChild(br);
                }
            })
        }
    }, [articleDetail.files])
    

    const editTitle = useCallback(e => {
        setTitle(e.target.value);
    }, [])
    
    const editContent = useCallback(e => {
        setContent(e.target.value);
    }, [])
    
    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const uploadFile = useCallback((e) => {
        const previewImg = document.getElementById('preview-img');
        const previewFile = document.getElementById('preview-file');
        const child = Array.from(document.getElementsByName('preview'));
        const els = Array.from(document.getElementsByName('el'));
        
        if(!_.isEmpty(inputFile[0].files)){
            setVisible(false);        
            fileName.length = 0;
            if(!_.isEmpty(els)){
                els.forEach(el => {
                    previewFile.removeChild(el);
                })
            }
            if(!_.isEmpty(child)){
                child.forEach(files => {
                    if(_.isEqual(files.nodeName, "IMG")){
                        previewImg.removeChild(files);
                    }else if(_.isEqual(files.nodeName, "SPAN")){
                        previewFile.removeChild(files);
                    }
                    URL.revokeObjectURL(files.src);
                })
            }

            setFiles(inputFile[0].files);
            Array.from(inputFile[0].files).forEach(file => {
                fileName.push(" " + file.name);
                setVisible(true);
                const fileType = file.type.split("/")[0];
                
                if(_.isEqual(fileType, "image")){
                    const image = document.createElement('img');
                    image.setAttribute("name", "preview");
                    image.className = "image-preview";
                    image.setAttribute("alt", file.name);
                    image.style = visible ? {display: "table-cell"} : {display: "none"};
                    image.src = URL.createObjectURL(file);
                    
                    image.title = file.name;
                    previewImg.appendChild(image);
                }else if(_.isEqual(fileType, "application") || _.isEqual(fileType, "video")){
                    const b = document.createElement('b'); // 새로 업로드된 파일임을 표시
                    b.textContent = "NEW!";
                    b.className = "new";
                    b.setAttribute("name", "el");

                    const br = document.createElement('br'); // 파일 목록 한 줄씩 출력(줄바꿈)
                    br.setAttribute("name", "el");

                    const doc = document.createElement('span');
                    doc.setAttribute("name", "preview");
                    doc.className = "application-preview";
                    doc.style = visible ? {display: "table-cell"} : {display: "none"};
                    doc.textContent = file.name;

                    previewFile.appendChild(b);
                    previewFile.appendChild(doc);
                    previewFile.appendChild(br);
                }
            })
        }
        
    }, [inputFile, fileName, visible]);
    
    for(let i = 0;i < files.length; i++){
        formData.append("file", files[i]);
    }

    const editArticle = (e) => {
        e.preventDefault();
        if(_.isEmpty(e.target.value)){ setTitle(articleDetail.title); }
        if(_.isEmpty(e.target.value)){ setContent(articleDetail.content); }

        let data = {
            data: {
                title : title,
                content : content,
                created_id : user?.code,
                category_id : selected
            }
        }
        formData.append("article", new Blob([JSON.stringify(data)], {type: "application/json"}));
        
        axios.put(`/board/withfile/${articleDetail?.id}`, formData)
        .then((res) => {
            alert("Article Edited");
            window.location.reload(`/board/${articleDetail?.id}`);
        }).catch((e) => {
            alert("Failed to edit article.\nPlease try again.");
        });
    }
    if(_.isEmpty(articleDetail)) {return <div> Loading ... </div>}
    else { 
        return(
            <>
                <b style={{fontSize: "25px", textAlign: "left"}}>Edit article</b><hr/>
                <form onSubmit={editArticle}>
                    <div className="div-box" style={{textAlign: "left", marginTop: "10px", marginBottom: "30px"}}>
                        <b style={{fontSize: "20px"}}>User ID : {user?.nick_name} </b><br/>
                        <b style={{fontSize: "17px"}}> Category : </b>
                        <select onChange={handleSelect} value={selected}>
                            {categoryList?.map((category, index) => {
                                return <option key={index} value={category.id}>{category.name}</option>;
                            })}
                        </select><br/>
                        <input style={{width:"100%", marginLeft: "0"}} type="text" value={title} onChange={editTitle} required autoFocus /> <br/>
                        <textarea style={{width:"100%"}} value={content} onChange={editContent} required /> <br/>

                        <input className="upload-name" style={{width:"85%", marginTop: "5px"}} value={fileName} disabled/>
                        <label className="upload" style={{width:"15%", marginTop: "5px"}} htmlFor="file"> Selecet File </label> 
                        <input type="file" name={"upfile"} id="file" style={{display:"none"}} onChange={uploadFile} multiple/>

                        <div style={{textAlign: "right", marginTop: "5px"}}>
                            <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Save </button>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"
                                    onClick={handleClose}> Back </button>
                        </div>
                    </div>
                </form>
                <div id='preview-zone'>
                    <b style={{fontSize: "30px"}}> File Preview </b><br/>
                    <div id='preview-img' style={visible ? {} : {display: "none"}}>
                        <b style={{fontSize: "20px"}}> [ Image ] </b><br/>
                    </div>
                    <div id='preview-file' style={visible ? {} : {display: "none"}}>
                        <b style={{fontSize: "20px"}}> [ File ] </b><br/>
                    </div>
                </div>
            </>
        )
    }
}

export  function isImage(dataType){
    if(_.isEqual(dataType, "jpg") || _.isEqual(dataType, "jpeg") || _.isEqual(dataType, "png")){
        return true;
    }else{
        return false;
    }
}

export default ArticleEditForm;