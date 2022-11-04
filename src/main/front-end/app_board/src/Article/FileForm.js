import { useMemo } from "react";
import axios from "axios";
import { canChange } from "../func";

function Files({files, user, createdId}) {
    let resource = useMemo(() => { return new Blob(); },[])

    function downloadFile(file){
        axios.get(`/download/${file.id}`, {responseType: "blob"})
        .then((res)=>{
            resource = res.data;
            const downloadUrl = window.URL.createObjectURL(resource);
            const anchor = document.createElement('a');

            document.body.appendChild(anchor);
            anchor.download = file.origin_name;
            anchor.href = downloadUrl;
            anchor.click();
    
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(downloadUrl);
        }).catch((e) => {
            console.log(e);
        })
    }

    function deleteFile(id, filename){
        if(window.confirm("Delete file " + filename + " ? ")){
            axios.delete(`/delete/${id}`).catch((e) => {
                console.log(e.response.status + " : " + e.response.statusText);
            })
            window.location.reload();
        }
    }

    return(
        <div style={{textAlign: "left"}}>
            {Array.from(files).map((file, index) => {
                return (<div key={index}>
                    {canChange(user, createdId) && 
                        <input type={"image"} src={require("../remove.png").default} alt={"icon"}
                                style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "middle", marginLeft: "10px"}}
                                onClick={() => {deleteFile(file.id, file.origin_name)}} />
                    }
                    <span className="filelink" onClick={() => {downloadFile(file)}}> 
                        &nbsp;&nbsp; {file.origin_name}  &nbsp;&nbsp; {Number(file.file_size).toFixed(2)} MB <br/>
                    </span>
                </div>)
            })}
        </div>
    )
}

export default Files;