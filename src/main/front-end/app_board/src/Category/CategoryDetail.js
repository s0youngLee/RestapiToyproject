import { useState, useEffect } from "react";
import _ from 'lodash';
import {Link, useLocation} from 'react-router-dom';
import { Delete, FetchWithoutId }from '../func';

function CategoryDeatil () {
    const [categoryData, setCategoryData] = useState();
    const currentloaction = useLocation();
    useEffect(() => {
        console.log(currentloaction);
    }, [currentloaction]); 

    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithoutId(categoryData, setCategoryData, "category");
        }
    }, [categoryData]);

    if(_.isEmpty(categoryData)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div>}
    else {
        return (
            <div className='div-box' style={{marginLeft: "10px"}}>
                <b style={{ fontSize: "40px"}}> 카테고리 관리 </b>
                <Link to={`/category/add`} className="none">
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> 새 카테고리 </button>
                </Link>
                <Link to={`/board/category/${categoryData.splice(0,1)[0].id}`} className="none">
                    <button className='w3-button w3-border w3-round-xlarge w3-small  w3-hover-deep-purple'> Default로 이동 </button>
                </Link>
                <hr/>
                {categoryData?.map((category, index) => {
                    return <li key={index}><CategoryDeatilData data={category} /></li>
                })}
            </div>
        ) 
    }
}

function CategoryDeatilData({data}) {
    return (
        <div style={{textAlign: "left"}}>
            {/* <b> ID : </b> <span> {data.id} </span><br/> */}
            <b> 카테고리 명 : </b><span> {data.name} </span><br/>
            <b> 게시글 개수 : {data.article_cnt} ea </b><br/>
            <Link to={`/board/category/${data.id}`} className="none">
                <button className='w3-button w3-border w3-round-xlarge w3-small  w3-hover-deep-purple'> {data.name}(으)로 이동 </button>
            </Link>
            <Link to={`/category/edit/${data.id}`} className="none">
                <button className="w3-button w3-border w3-round-xlarge w3-small  w3-hover-teal"> 수정 </button>
            </Link>
            <button className="w3-button w3-border w3-round-xlarge w3-small  w3-hover-red" 
                    onClick={() => { Delete("category", data.id) }}> 삭제 </button>
        </div>
    )
}

export default CategoryDeatil