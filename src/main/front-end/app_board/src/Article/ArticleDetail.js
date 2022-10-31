import { Link } from 'react-router-dom';
import Comment from "../Comment/Comment";
import { FetchWithId, Delete, canChange } from '../func';
import _ from 'lodash';
import { useState } from 'react';
import ArticleEdit from './ArticleEdit';
// import { Modal } from 'reactstrap';
// import Modal from 'reactstrap/types/lib/Modal';
import { Modal } from 'react-bootstrap';
import ModalForm from './Modal';

function ArticleDeatil({user, isLogin}){
    const articleDetail = FetchWithId("board", 1).data;
    if(!articleDetail) { return <div> Loading .. </div>}
    else { return <ArticleDetailData data={articleDetail} user={user} isLogin={isLogin}/>; }
}

function ArticleDetailData({data, user, isLogin}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleShow = () => setIsOpen(true);

    const Modal = ({isOpen}) => {
        return !isOpen ? null : <ModalForm user={user} articleDetail={data} handleClose={handleClose}/>
    }

    if(!data?.created_id){ return <div> Loading ... </div> }
    else {
        return (
            <div style={{marginLeft: "10px"}}>
                <div style={{padding: "10px", overflow: "auto"}}>
                    <div style={{float: "left", width: "500px", marginRight: "20px", padding: "10px", overflow: "auto"}}>
                        <h1>Article Detail</h1> <br/>
                        <b> ID : </b> <span> {data?.id} </span> <br/>
                        <b> Title : </b> <span> {data?.title} </span> <br/>
                        <b> Category : </b> <span> {data?.category_name} </span> <br/>
                        <b> Content : </b> <span> {data?.content} </span> <br/>
                        <b> Created By : </b> <span> {data?.created_id} </span> <br/>
                        <b> Created At : </b> <span> {data?.created_at} </span> <br/>
                        <b> Visit : </b> <span> {data?.visit_cnt} </span> 
                        <div style={{float: "right"}}>
                            { _.isEqual(data?.created_id, user?.nick_name) &&
                                <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                        onClick={() => setIsOpen(true)}>Edit</button>
                                // <Link to={`/board/edit/${data?.id}`} className="none" >
                                //     <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 
                                //         Edit </button></Link>
                            }
                            {/* <Modal className="popup-content" isOpen={isOpen} /> */}
                            <dialog open={isOpen}>
                                <dialogtitle> <b style={{fontSize: "20px"}}>Edit article </b></dialogtitle>
                                <dialogcontent>
                                <ModalForm user={user} articleDetail={data} handleClose={handleClose}/>
                                </dialogcontent>
                            </dialog>
                            {canChange(user, data?.created_id) &&
                                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                                        onClick={() => { Delete("board", data.id) }}>Delete</button>}
                        </div>
                    </div>
                </div><hr/>
                <Comment article={data} user={user} isLogin={isLogin}/>
            </div>
        )
    }
}

export default ArticleDeatil;