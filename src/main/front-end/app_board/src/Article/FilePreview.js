import { useState } from "react";
import _ from "lodash";

function FilePreview(){
    const [visible, setVisible] = useState(false);
    
    return (
        <div id='preview-zone'>
            <b style={{fontSize: "30px"}}> File Preview </b><br/>
            <div id='preview-img' style={visible ? {} : {display: "none"}}>
                <b style={{fontSize: "20px"}}> &lt; Image &gt; </b><br/>
            </div>
            <div id='preview-file' style={visible ? {} : {display: "none"}}>
                <b style={{fontSize: "20px"}}> &lt; File &gt; </b><br/>
            </div>
        </div>
    )
}

export default FilePreview;

export function makePreview (inputFiles, visible, setVisible){
        const previewImg = document.getElementById('preview-img');
        const previewFile = document.getElementById('preview-file');
        const child = Array.from(document.getElementsByName('preview'));
        const brs = Array.from(document.getElementsByName('br'));
        
        if(!_.isEmpty(inputFiles)){
            setVisible(false); 
            if(!_.isEmpty(brs)){
                brs.forEach(br => {
                    previewFile.removeChild(br);
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

            Array.from(inputFiles).forEach(file => {
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
                }else if(_.isEqual(fileType, "application")){
                    const doc = document.createElement('span');
                    const br = document.createElement('br');
                    br.setAttribute("name", "br");
                    doc.setAttribute("name", "preview");
                    doc.className = "application-preview";
                    doc.style = visible ? {display: "table-cell"} : {display: "none"};
                    doc.textContent = file.name;
                    previewFile.appendChild(doc);
                    previewFile.appendChild(br);
                }
            })
        }
    }