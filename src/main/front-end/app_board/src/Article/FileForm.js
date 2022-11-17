import { useMemo } from "react";
import axios from "axios";
import { canRemove, Download } from "../func";
import _ from "lodash";

function Files({files, createdId}) {
    let resource = useMemo(() => { return new Blob(); },[])

    function deleteFile(id, filename){
        // if(window.confirm("Delete file " + filename + " ? ")){
        if(window.confirm(filename + " 을 삭제하시겠습니까? ")){
            axios.delete(`/delete/${id}`).catch((e) => {
                console.log(e.response.status + " : " + e.response.statusText);
            })
            window.location.reload();
        }
    }

    if(_.isEmpty(files)){ <div style={{textAlign: "left"}}> No Files </div>}
    else{
        return(
            <div style={{textAlign: "left"}}>
                {Array.from(files).map((file, index) => {
                    return (<div key={index}>
                        <span>{file.origin_name}  &nbsp;&nbsp; {Number(file.file_size).toFixed(2)} MB </span>
                        { canRemove(createdId) && 
                            <input type={"image"} src={require("../Icon/remove.png").default} alt={"icon"}
                                style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "middle", marginLeft: "10px"}}
                                onClick={() => {deleteFile(file.id, file.origin_name)}} />
                        }
                        { _.isEqual(sessionStorage.getItem("login"), "true") &&
                            <input type={"image"} src={require("../Icon/download.png").default} alt={"icon"}
                                style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "middle", marginLeft: "10px"}}
                                onClick={() => {Download(resource, "download", file.id, file.origin_name)}} />
                        }
                        <br/> 
                    </div>)
                })}
            </div>
        )
    }
}

export default Files;