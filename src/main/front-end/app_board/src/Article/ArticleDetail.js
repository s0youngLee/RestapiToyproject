import { useState, useMemo, useEffect } from 'react';
import { FetchWithId, Delete, canRemove, Download, isPublisher, isLogin } from '../func';
import _ from 'lodash';
import * as Modal from 'react-modal';
import Comment from "../Comment/Comment";
import Files from './FileForm';
import ArticleEditForm from './ArticleEdit';
import axios from 'axios';
import PageNotFound from '../PageNotFound';

function ArticleDeatil(){
    const [articleDetailData, setArticleDetailData] = useState();
    const [articleDetail, setArticleDetail] = useState();

    useEffect(() => {
        if(_.isEmpty(articleDetailData)){
            FetchWithId(articleDetailData, setArticleDetailData, "article", 1);
        }else {
            setArticleDetail(articleDetailData);
        }
    }, [articleDetailData, articleDetail]);

    if(_.isEmpty(articleDetail)) { return <div style={{marginTop : "100px"}}> Loading .. </div>}
    else { return <ArticleDetailData data={articleDetail} />; }
}

function ArticleDetailData({data}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {setIsOpen(false);}
    let resource = useMemo(() => { return new Blob(); },[]);

    function downloadAll(){
        Download(resource, "file/downloadzip", data.id, data.title);
        axios.get(`/download/complete/${data.id}`);
    }

    function copyToClipboard(content){
        if(navigator.clipboard!==undefined){
            navigator.clipboard.writeText(content).then(() => {
                alert("복사되었습니다.");
            }).catch((e) => {
                console.log(e);
                alert("복사에 실패했습니다.");
            });
        }else{
            alert("navigation.clipboard == undefined");
        }
    }


    if(_.isEmpty(data)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div> }
    else if(_.isEqual(data, "No DATA")){ return <PageNotFound /> }
    else {
        return (
            <><div className='div-box' style={{padding: "10px", overflow: "auto", marginLeft: "10px", textAlign: "left", height: "80vh"}}>
                    <b style={{fontSize: "30px"}}>{data?.title}</b><br/>
                    <span style={{fontSize: "17px", color: "gray"}}> {data?.created_at} </span><br/>
                    <span style={{fontSize: "17px"}}> Posted in <b>{data?.category_name} </b> by <b> {data.user_nickname} </b> / visit : <b>{data?.visit_cnt}</b></span>
                    <div className='content-box'> 
                        <input type={"image"} src={require("../Icon/copy.png").default} alt={"icon"}
                            style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "bottom", float: 'right', marginLeft: "10px"}}
                            onClick={() => { copyToClipboard(data.content) }} />
                        <br/>{data.content}
                    </div>
                    <span style={{fontSize:"17px", color:"gray"}}> Finally edited : {data?.final_edit_date} </span><br/>
                   
                    <b style={{fontSize: "17px"}}> File list </b>
                    {isLogin && !_.isEmpty(data.files) &&
                        <>
                        <button onClick={() => { downloadAll() }}
                            className="w3-button w3-border w3-round-xlarge w3-small w3-hover-light-blue"> Download All </button>
                        <br/>
                        </>
                    }
                    <Files files={data.files}  createdId={data.user_nickname}/>
                    { isPublisher(data.user_nickname) &&
                        <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => setIsOpen(true)}>Edit</button>
                    }
                    <Modal isOpen={isOpen} onRequestClose={handleClose}>
                        <ArticleEditForm articleDetail={data} handleClose={handleClose} />
                    </Modal>
                    <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                            onClick={() => { Delete("article", data.id) }}>Delete</button>
                    { canRemove(data.user_nickname) &&
                        <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                                onClick={() => { Delete("article", data.id) }}>Delete</button>
                    }
                </div><hr/>
                <Comment comments={data.comment}/>
            </>
        )
    }
}

export default ArticleDeatil;
Modal.setAppElement('#root')