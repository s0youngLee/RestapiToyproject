import { useState, useMemo } from 'react';
import { FetchWithId, Delete, canChange, Download } from '../func';
import _ from 'lodash';
import * as Modal from 'react-modal';
import Comment from "../Comment/Comment";
import Files from './FileForm';
import ArticleEditForm from './ArticleEdit';
import axios from 'axios';

function ArticleDeatil({user, isLogin}){
    const articleDetail = FetchWithId("board", 1).data;
    if(!articleDetail) { return <div> Loading .. </div>}
    else { return <ArticleDetailData data={articleDetail} user={user} isLogin={isLogin}/>; }
}

function ArticleDetailData({data, user, isLogin}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {setIsOpen(false);}
    let resource = useMemo(() => { return new Blob(); },[])

    function downloadAll(){
        Download(resource, "download/zip", data.id, data.title);
        axios.get(`/download/complete/${data.id}`);
    }

    function copyToClipboard(){
        try{
            navigator.clipboard.writeText(data.content);
            alert("Successfully copied.");
        }catch{
            alert("Copy content failed");
        }
    }

    if(!data?.created_id){ return <div> Loading ... </div> }
    else {
        return (
            <><div className='div-box' style={{padding: "10px", overflow: "auto", marginLeft: "20px", textAlign: "left", height: "57vh"}}>
                    <b style={{fontSize: "30px"}}>{data?.title}</b><br/>
                    <span style={{fontSize: "17px", color: "gray"}}> {data?.created_at} </span><br/>
                    <span style={{fontSize: "17px"}}> Posted in <b>{data?.category_name} </b> by <b>{data?.created_id} </b> / visit : <b>{data?.visit_cnt}</b></span>
                    <div className='content-box'> 
                        <input type={"image"} src={require("../copy.png").default} alt={"icon"}
                            style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "bottom", float: 'right', marginLeft: "10px"}}
                            onClick={() => { copyToClipboard() }} />
                        <br/>{data.content}
                    </div>
                    <span style={{fontSize:"17px", color:"gray"}}> Finally edited : {data?.final_edit_date} </span><br/>
                   
                    <b style={{fontSize: "17px"}}> File list </b>
                    <button onClick={() => { downloadAll() }}
                            className="w3-button w3-border w3-round-xlarge w3-small w3-hover-light-blue"> Download All </button>
                    <br/>
                    <Files files={data?.files} user={user} createdId={data?.id}/>
                    { _.isEqual(data?.created_id, user?.nick_name) &&
                        <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => setIsOpen(true)}>Edit</button>
                    }
                    <Modal isOpen={isOpen} onRequestClose={handleClose}>
                        <ArticleEditForm user={user} articleDetail={data} handleClose={handleClose} />
                    </Modal>
                    {canChange(user, data?.created_id) &&
                        <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                                onClick={() => { Delete("board", data.id) }}>Delete</button>
                    }
                </div><hr/>
                <Comment article={data} user={user} isLogin={isLogin}/>
            </>
        )
    }
}

export default ArticleDeatil;
Modal.setAppElement('#root')