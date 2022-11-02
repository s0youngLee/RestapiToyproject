import { useMemo } from "react";
import axios from "axios";
import { canChange } from "../func";

function Files({files, user, createdId}) {
    let resource = useMemo(() => { return new Blob(); },[])

    function downloadFile(file){
        axios.get(`/download/${file.id}`, {responseType: "blob"})
        .then((res)=>{
            resource = res.data;
            // console.log("downloading "+ file.origin_name + " ...");
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
        <>
            {Array.from(files).map((file, index) => {
                return (
                    <li key={index}>
                        fileName : {file.origin_name} <br/>
                        fileSize : {Number(file.file_size).toFixed(2)} MB <br/>
                        date : {file.date} 
                        <button className='w3-button w3-border w3-round-xlarge w3-small w3-hover-cyan' id='download' value={"download"}
                                onClick={() => {downloadFile(file)}} >Download</button>
                        {canChange(user, createdId) && <button className='w3-button w3-border w3-round-xlarge w3-small w3-hover-red'
                                onClick={() => {deleteFile(file.id, file.origin_name)}}>Delete</button>
                        }
                    </li>
                )
            })}
        </>
    )
}

export default Files;