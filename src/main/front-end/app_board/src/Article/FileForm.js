import { useMemo } from "react";
import axios from "axios";
import { canRemove, Download, isLogin } from "../func";
import _ from "lodash";

function Files({files, createdId}) {
    let resource = useMemo(() => { return new Blob(); },[])

    function deleteFile(id, filename){
        if(window.confirm(filename + " 을 삭제하시겠습니까? ")){
            const test = prompt("\"test\" 를 입력하세요");
            if(_.isEqual(test, "test")){
                axios.delete(`/file/delete/${id}`).catch((e) => {
                    console.log(e.response.status + " : " + e.response.statusText);
                })
                window.location.reload();
            }else{
                alert("입력값이 올바르지 않습니다.\n삭제에 실패했습니다.");
            }
        }
    }

    if(_.isEmpty(files)){ <div style={{textAlign: "left"}}> No Files </div>}
    else{
        return(
            <div style={{textAlign: "left"}}>
                {Array.from(files).map((file, index) => {
                    return (
                        <li className="list" key={index} style={{margin: "0", marginTop: "5px", padding: "5px"}}>
                            {file.origin_name}  <br/> ( {Number(file.file_size).toFixed(2)} MB )
                            { canRemove(createdId) && 
                                <input type={"image"} src={require("../Icon/remove.png").default} alt={"icon"}
                                    style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "middle", marginLeft: "10px"}}
                                    onClick={() => {deleteFile(file.id, file.origin_name)}} />
                            } 
                            {isLogin &&
                                <input type={"image"} src={require("../Icon/download.png").default} alt={"icon"}
                                    style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "middle", marginLeft: "10px"}}
                                    onClick={() => {Download(resource, "file/download", file.id, file.origin_name)}} />
                            }
                        </li>
                    )
                })}
            </div>
        )
    }
}

export default Files;