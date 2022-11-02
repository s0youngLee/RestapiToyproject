import { useState } from 'react';
import { FetchWithId, Delete, canChange } from '../func';
import _ from 'lodash';
import * as Modal from 'react-modal';
import Comment from "../Comment/Comment";
import Files from './FileForm';
import ArticleEditForm from './ArticleEdit';

function ArticleDeatil({user, isLogin}){
    const articleDetail = FetchWithId("board", 1).data;
    if(!articleDetail) { return <div> Loading .. </div>}
    else { return <ArticleDetailData data={articleDetail} user={user} isLogin={isLogin}/>; }
}

function ArticleDetailData({data, user, isLogin}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {setIsOpen(false);}

    if(!data?.created_id){ return <div> Loading ... </div> }
    else {
        return (
            <><div style={{padding: "10px", overflow: "auto"}}>
                    <div style={{float: "left", width: "500px", marginRight: "20px", padding: "10px", overflow: "auto"}}>
                        <h1>Article Detail</h1> <br/>
                        <b> ID : </b> <span> {data?.id} </span> <br/>
                        <b> Title : </b> <span> {data?.title} </span> <br/>
                        <b> Category : </b> <span> {data?.category_name} </span> <br/>
                        <b> Content : </b> <span> {data?.content} </span> <br/>
                        <b> Created By : </b> <span> {data?.created_id} </span> <br/>
                        <b> Created At : </b> <span> {data?.created_at} </span> <br/>
                        <b> Visit : </b> <span> {data?.visit_cnt} </span> <br/>
                        <Files files={data?.files} user={user} createdId={data?.id}/>
                        <div style={{float: "right"}}>
                            { _.isEqual(data?.created_id, user?.nick_name) &&
                                <button style={{float: "right"}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"
                                        onClick={() => setIsOpen(true)}>Edit</button>
                            }
                            <Modal isOpen={isOpen} onRequestClose={handleClose}>
                                <ArticleEditForm user={user} articleDetail={data} handleClose={handleClose} />
                            </Modal>
                            {canChange(user, data?.created_id) &&
                                <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red" 
                                        onClick={() => { Delete("board", data.id) }}>Delete</button>
                            }
                        </div>
                    </div>
                </div><hr/>
                <Comment article={data} user={user} isLogin={isLogin}/></>
        )
    }
}

export default ArticleDeatil;
Modal.setAppElement('#root')