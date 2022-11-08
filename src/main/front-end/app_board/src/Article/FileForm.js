import { useMemo } from "react";
import axios from "axios";
import { canChange, Download } from "../func";

function Files({files, user, createdId}) {
    let resource = useMemo(() => { return new Blob(); },[])

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
                    <span className="filelink" onClick={() => {Download(resource, "download", file.id, file.origin_name)}}> 
                        &nbsp;&nbsp; {file.origin_name}  &nbsp;&nbsp; {Number(file.file_size).toFixed(2)} MB <br/>
                    </span>
                </div>)
            })}
        </div>
    )
}

export default Files;