import { useState, useMemo, useEffect } from 'react';
import { FetchWithId, Delete, canRemove, Download, isPublisher, isLogin, PageviewCount } from '../func';
import _ from 'lodash';
import * as Modal from 'react-modal';
import Comment from "../Comment/Comment";
import Files from './FileForm';
import ArticleEditForm from './ArticleEdit'; 
import PageNotFound from '../PageNotFound';
import { useLocation } from 'react-router-dom';

function ArticleDeatil(){
    const [articleDetailData, setArticleDetailData] = useState();

    const currentlocation = useLocation();
    useEffect(() => {
        PageviewCount(currentlocation.pathname, "게시물 조회");
    }, [currentlocation]);

    useEffect(() => {
        if(_.isEmpty(articleDetailData)){
            FetchWithId(articleDetailData, setArticleDetailData, "article", 1);
        }
    }, [articleDetailData]);

    if(_.isEmpty(articleDetailData)) { return <div style={{marginTop : "100px"}}> Loading .. </div>}
    else { return <ArticleDetailData data={articleDetailData} />; }
}

function ArticleDetailData({data}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {setIsOpen(false);}
    let resource = useMemo(() => { return new Blob(); },[]);

    function downloadAll(){
        Download(resource, "file/downloadzip", data.id, data.title);
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
                    <span style={{fontSize: "17px"}}> Posted in <b>{data?.category_name} </b> by <b> {data.user_nickname} </b></span>
                    <span style={{fontSize: "15px", float: "right"}}> 조회수 : <b>{data?.visit_cnt}</b></span>
                    <div className='content-box'> 
                        <input type={"image"} src={require("../Icon/copy.png").default} alt={"icon"}
                            style={{width:"20px", height:"20px", objectFit: "fill", verticalAlign: "bottom", float: 'right', marginLeft: "10px"}}
                            onClick={() => { copyToClipboard(data.content) }} />
                        <br/>{data.content}
                    </div>
                    <span style={{fontSize:"17px", color:"gray"}}> 최종 수정일 : {data?.final_edit_date} </span><br/>
                   
                    <b style={{fontSize: "17px"}}> 파일 목록 </b>
                    {isLogin && !_.isEmpty(data.files) &&
                        <>
                        <button onClick={() => { downloadAll() }}
                            className="w3-button w3-border w3-round-xlarge w3-small w3-hover-light-blue"> 모든 파일 다운로드(.zip) </button>
                        <br/>
                        </>
                    }
                    <Files files={data.files}  createdId={data.user_nickname}/>
                    { isPublisher(data.user_nickname) &&
                        <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                onClick={() => setIsOpen(true)}>수정</button>
                    }
                    <Modal isOpen={isOpen} onRequestClose={handleClose}>
                        <ArticleEditForm articleDetail={data} handleClose={handleClose} />
                    </Modal>
                    { canRemove(data.user_nickname) &&
                        <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                                onClick={() => { Delete("article", data.id) }}>삭제</button>
                    }
                </div><hr/>
                <Comment comments={data.comment}/>
            </>
        )
    }
}

export default ArticleDeatil;
Modal.setAppElement('#root')