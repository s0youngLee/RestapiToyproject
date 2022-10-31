import {useState, useCallback} from 'react';
import {getUrlId, FetchWithoutId} from "../func";
import axios from "axios";
import _ from 'lodash';

function ArticleRegister({user}){
    const urlId = getUrlId(1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selected, setSelected] = useState(urlId);
    
    const formData = new FormData();
    const inputFile = document.getElementsByName("upfile");
    const [fileName, setFileName] = useState(["Upload File",]);
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
        if(!_.isEmpty(inputFile)){
            setFiles(inputFile[0].files);
            setFileName(inputFile[0].files[0].name);
        }
    }, [inputFile]);
    
    for(let i = 0;i < files.length; i++){
        formData.append("uploadFiles", files[i]);
    }

    const addArticle = (e) => {
        e.preventDefault();

        console.log(formData.get("uploadFiles"));
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
        
        axios.post("/upload", formData)
        .then(() => {
            console.log("post success");
        })
        .catch((err) => {
            console.log("Status code : " + err.response.status + ", " + err.response.statusText);
        })
    }


    return(
        <div className="div-box">
            <form onSubmit={addArticle}>
                <b style={{ fontSize: "40px"}}> Add Article </b> <hr/>

                <div style={{width: "50%", margin: "auto", textAlign: "left"}}>
                    <b style={{fontSize: "20px", justifyContent: "left"}}>User ID : {user?.nick_name} </b><br/>
                    <b> Category : </b>
                    <select onChange={handleSelect} value={selected}>
                        {Array.from(FetchWithoutId("category").data)?.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>;
                        })}
                    </select><br/>
                    <input type={"text"} placeholder='Title' onChange={addTitle} required autoFocus></input> <br/>
                    <textarea placeholder='Content' className="text-box" onChange={addContent} required></textarea> <br/>

                    <input className="upload-name" value={fileName} disabled/>
                    <label className="upload" htmlFor="file"> upload </label> 
                    <input type="file" name={"upfile"} id="file" style={{display:"none"}} onChange={uploadFile}/>
                </div><br/>

                <button type="submit" className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal" 
                       > Add </button>
            </form>
        </div>
    )
}

export default ArticleRegister;