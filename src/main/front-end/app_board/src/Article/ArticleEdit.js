import {useState, useCallback} from "react";
import { FetchWithoutId } from "../func";
import axios from "axios";
import _ from "lodash";

function EditModalForm({user, articleDetail, handleClose}){
    const categoryList = Array.from(FetchWithoutId("category").data);

    const [title, setTitle] = useState(articleDetail.title);
    const [content, setContent] = useState(articleDetail.content);
    const [selected, setSelected] = useState(articleDetail.category_id);

    const formData = new FormData();
    const inputFile = document.getElementsByName("upfile");
    const [fileName, setFileName] = useState(["Upload File",]);
    const [files, setFiles] = useState({data : {}});

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
        if(!_.isEmpty(inputFile)){
            setFiles(inputFile[0].files);
            setFileName(inputFile[0].files[0].name);
        }
    }, [inputFile]);
    
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
                created_id : user?.nick_name,
                category_id : selected
            }
        }
        formData.append("article", new Blob([JSON.stringify(data)], {type: "application/json"}));
        
        axios.put(`/board/withfile/${articleDetail?.id}`, formData)
        .then((res) => {
            alert("Article Edited");
            window.location.reload(`/board/${articleDetail?.id}`);
        }).catch((e) => {
            console.log(formData.get("article"))
            console.log(formData.get("file"))
            alert("Failed to edit article.\nPlease try again.");
            window.location.replace(`/board/${articleDetail?.id}`);
        });
    }
    if(_.isEmpty(articleDetail)) {return <div> Loading ... </div>}
    else { 
        return(
            <>
                <b style={{fontSize: "25px", textAlign: "left"}}>Edit article</b><hr/>
                <form onSubmit={editArticle}>
                    <div style={{margin: "auto", textAlign: "left"}}>
                        <b style={{fontSize: "20px"}}>User ID : {user?.nick_name} </b><br/>
                        <b style={{fontSize: "17px"}}> Category : </b>
                        <select onChange={handleSelect} value={selected}>
                            {categoryList?.map((category, index) => {
                                return <option key={index} value={category.id}>{category.name}</option>;
                            })}
                        </select><br/>
                        <input type="text" value={title} onChange={editTitle} required autoFocus /> <br/>
                        <textarea className="text-box" value={content} onChange={editContent} required /> <br/>

                        <input className="upload-name" value={fileName} disabled/>
                        <label className="w3-button w3-border w3-round-large w3-small w3-hover-teal" htmlFor="file"> upload </label> 
                        <input type="file" name={"upfile"} id="file" style={{display:"none"}} onChange={uploadFile} multiple/>
                    </div>

                    <div style={{textAlign: "right"}}>
                        <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" > Save </button>
                        <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"
                                onClick={handleClose}> Back </button>
                    </div>
                </form>
            </>
        )
    }
}

export default EditModalForm;