import {useState, useCallback, useMemo, useEffect} from "react";
import { FetchWithoutId, userCode } from "../func";
import axios from "axios";
import _ from "lodash";

function ArticleEditForm({articleDetail, handleClose}){
    const [categoryList, setCategoryList] = useState();
    const [categoryData, setCategoryData] = useState();
    
    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithoutId(categoryData, setCategoryData, "category");
        }else{
            setCategoryList(categoryData);
        }
    }, [categoryData]);

    const [checkedInfile, setCheckedInfile] = useState(new Set()); // db에 올라가 있는 파일 (이미 첨부된 파일 중 체크 - 삭제해야함)
    const [checkedUpload, setCheckedUpload] = useState(new Set()); // input file로 선택한 파일 (첨부되어 있지 않은 파일 - 전송할 formdata에 올리지 않아야함)

    // article title, content, category 수정
    const [title, setTitle] = useState(articleDetail.title);
    const [content, setContent] = useState(articleDetail.content);
    const [selected, setSelected] = useState(articleDetail.category_id);

    // 파일 업로드용 formdata
    const inputFile = document.getElementsByName("upfile"); // file input
    const fileName = useMemo(() => {return new Array("파일 선택")},[]); // 파일 입력란에 띄울 선택된 파일 이름 리스트
    const [files, setFiles] = useState({data : {}}); // 파일 목록
    const [visible, setVisible] = useState(false); // 선택된 파일 또는 첨부된 파일이 없을 경우 visible false

    const checkedItemHandler = useCallback((id, type, isChecked) => {
        if(isChecked) {
            if(_.isEqual(type, "infile")){
               checkedInfile.add(id);
               setCheckedInfile(checkedInfile); 
            }else{
                checkedUpload.add(id);
                setCheckedUpload(checkedUpload);
            }
        } else if (!isChecked && checkedInfile.has(id)) {
            checkedInfile.delete(id);
            setCheckedInfile(checkedInfile);
        } else if (!isChecked && checkedUpload.has(id)) {
            checkedUpload.delete(id);
            setCheckedUpload(checkedUpload);
        }
    }, [checkedInfile, checkedUpload]);

    const checkHandler = useCallback(({ target }, id, file, fileType, labelClass, inputType) => { 
        checkedItemHandler(id, inputType, target.checked);
        if(_.isEqual(fileType, "image")){
            file.style = target.checked ? "background-color: crimson;" : (_.isEqual(labelClass, "-uploaded") ? "background-color: cornflowerblue;" : "");
        }else{
            file.style = target.checked ? "color: crimson;" : (_.isEqual(labelClass, "-uploaded") ? "color: cornflowerblue;" : "");
        }
    }, [checkedItemHandler]);

    const previewImage = useCallback((filedata, fileIndex, fileName, className, labelClass, previewDiv, inputType) => {
        const checkbox = makeCheckbox(fileIndex, "image", className);
        const label = makeLabel(fileIndex, "image", labelClass);
        const image = makeImage(filedata, fileName, className);
        checkbox.oninput = (e) => {
            checkHandler(e, fileIndex, image, "image", labelClass, inputType);
        }

        previewDiv.appendChild(checkbox);
        previewDiv.appendChild(label);
        label.appendChild(image);
    }, [checkHandler]);

    const previewDocument = useCallback((fileName, fileIndex, className, labelClass, previewDiv, inputType) => {
        const checkbox = makeCheckbox(fileIndex, "document", className);
        const label = makeLabel(fileIndex, "document", labelClass);
        const doc = makeDoc(fileName, className);
        checkbox.oninput = (e) => {
            checkHandler(e, fileIndex, doc, "document", labelClass, inputType);
        }
        
        previewDiv.appendChild(checkbox);
        previewDiv.appendChild(label);
        label.appendChild(doc);
        previewDiv.appendChild(makeBr(className));
    }, [checkHandler]);
    
    useEffect(() => {
        if(!_.isEmpty(articleDetail.files)){
            setVisible(true);
            Array.from(articleDetail.files).forEach((file, index) => {
                const name = file.origin_name.split(".");
                const fileType = name[name.length-1];
                
                if(isImage(fileType)){
                    axios.get(`/file/download/${file.id}`, {responseType: "blob"})
                    .then((res)=>{
                        previewImage(res.data, file.id, file.name, "", "", document.getElementById('preview-img'), "infile");
                    });
                }else {
                    previewDocument(file.origin_name, file.id, "", "", document.getElementById('preview-file'), "infile");
                }
            })
        }
    }, [articleDetail.files, previewDocument, previewImage])
    

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
        const previewImg = document.getElementById('preview-img'); //img div
        const previewFile = document.getElementById('preview-file'); //doc div
        const imageUploaded = Array.from(document.getElementsByName('image-preview-uploaded')); //uploaded image (with checkbox, label element)
        const docUploaded = Array.from(document.getElementsByName('document-preview-uploaded')); //uploaded document (with br element)
        
        if(!_.isEmpty(inputFile[0].files)){
            fileName.length = 0;
            checkedUpload.clear();
            if(!_.isEmpty(imageUploaded)){
                for(let i=0;i<imageUploaded.length;i++){
                    if(!(imageUploaded[i].nodeName === "IMG")){
                        previewImg.removeChild(imageUploaded[i]);
                    }
                }
            }
            if(!_.isEmpty(docUploaded)){
                for(let i=0;i<docUploaded.length;i++){
                    if(!(docUploaded[i].nodeName === "SPAN")){
                        previewFile.removeChild(docUploaded[i]);
                    }
                }
            }

            setFiles(inputFile[0].files);
            
            Array.from(inputFile[0].files).forEach((file, index) => {
                fileName.push(" " + file.name);
                setVisible(true);
                const fileType = file.type.split("/")[1];
                
                if(isImage(fileType)){
                    previewImage(file, index, file.name, "-uploaded", "-uploaded", previewImg, "upload");
                }else {
                    previewDocument(file.name, index, "-uploaded", "-uploaded", previewFile, "upload");
                }
            })
        }
        
    }, [inputFile, fileName, checkedUpload, previewDocument, previewImage]);


    const editArticle = (e) => {
        e.preventDefault();
        if(_.isEmpty(e.target.value)){ setTitle(articleDetail.title); }
        if(_.isEmpty(e.target.value)){ setContent(articleDetail.content); }

        const formData = new FormData();
        for(let i = 0;i < files.length; i++){
            if(checkedUpload.has(i) === false){
                formData.append("file", files[i]);
                console.log(files[i].name);
            }
        }

        let data = {
            title : title,
            content : content,
            created_id : userCode,
            category_id : selected
        }
        formData.append("article", new Blob([JSON.stringify(data)], {type: "application/json"}));
        
        axios.put(`/article/${articleDetail?.id}`, formData)
        .then((res) => {
            Array.from(checkedInfile).map(async fileId => {
                try {
                    return await axios.delete(`/file/delete/${fileId}`);
                } catch (e) {
                    console.log(e.response.status + " : " + e.response.statusText);
                }
            })
            alert("게시글이 수정되었습니다.");
            window.location.reload(`/board/${articleDetail?.id}`);
        }).catch((e) => {
            alert("게시글 수정에 실패했습니다.\n다시 시도해주세요.");
        });
    }
    if(_.isEmpty(articleDetail)) {return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div>}
    else { 
        return(
            <div style={{marginTop: "0", marginLeft: "5px"}}>
                <b style={{fontSize: "25px", textAlign: "left"}}>게시글 수정</b><hr/>
                <form onSubmit={editArticle}>
                    <div className="modal-box">
                        <b style={{fontSize: "small"}}> 카테고리 : </b>
                        <select onChange={handleSelect} value={selected}>
                            {categoryList?.map((category, index) => {
                                return <option key={index} value={category.id}>{category.name}</option>;
                            })}
                        </select><br/>
                        <input style={{width:"100%", marginLeft: "0"}} type="text" value={title} onChange={editTitle} required autoFocus /> <br/>
                        <textarea style={{width:"100%", height: "50%"}} value={content} onChange={editContent} required /> <br/>

                        <input className="upload-name" style={{width:"80%", marginTop: "5px"}} value={fileName} disabled/>
                        <label className="upload" style={{width:"20%", marginTop: "5px"}} htmlFor="file"> 
                            <img src={require("../Icon/upload.png").default} alt={"icon"} style={{width: "20px", marginTop: "5px"}}/>
                        </label> 
                        <input type="file" name={"upfile"} id="file" style={{display:"none"}} onChange={uploadFile} multiple/>

                        <div style={{textAlign: "center", marginTop: "5px"}}>
                            <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Save </button>
                            <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"
                                    onClick={handleClose}> Back </button>
                        </div>
                    </div>
                </form>
                <div id='preview-zone'>
                    <b style={{fontSize: "medium"}}> File Preview </b><br/>
                    <div id='preview-img' style={visible ? {} : {display: "none"}}>
                        <b style={{fontSize: "small"}}> [ Image ] </b><br/>
                    </div>
                    <div id='preview-file' style={visible ? {} : {display: "none"}}>
                        <b style={{fontSize: "small"}}> [ File ] </b><br/>
                    </div>
                </div>
            </div>
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

export function makeDoc(fileName, attName){
    const doc = document.createElement('span');
    doc.setAttribute("name", "document-preview" + attName);
    doc.className = "document-preview";
    doc.style = _.isEqual(attName, "-uploaded") ? "color: cornflowerblue;" : "";
    doc.textContent = fileName;
    return doc;
}

export function makeBr(attName){
    const br = document.createElement('br');
    br.setAttribute("name", "document-preview" + attName);
    return br;
}

export function makeImage(file, fileName, attName){
    const image = document.createElement('img');
    image.setAttribute("name", "image-preview" + attName);
    image.className = "image-preview";
    image.style = _.isEqual(attName, "-uploaded") ? "background-color: cornflowerblue;" : "";
    image.setAttribute("alt", fileName);
    image.src = URL.createObjectURL(file);
    image.title = fileName;
    return image;
}

export function makeLabel(index, fileType, labelClass){
    const label = document.createElement('label');
    label.setAttribute("name", fileType + "-preview" + labelClass);
    label.htmlFor = "checkboxImage"+index;
    label.key = index;
    label.className = fileType + "-label" + labelClass;

    return label;
}

export function makeCheckbox(index, fileType, attName){
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.setAttribute("name", fileType + "-preview" + attName);
    checkbox.id = "checkboxImage"+index;
    checkbox.key = index;
    checkbox.className = "w3-check";
    checkbox.style = "display: none;";

    return checkbox;
}

export default ArticleEditForm;