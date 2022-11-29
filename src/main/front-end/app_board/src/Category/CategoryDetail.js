import { useState, useEffect } from "react";
import _ from 'lodash';
import {Link} from 'react-router-dom';
import { Delete, FetchWithoutId }from '../func';

function CategoryDeatil () {
    const [categoryList, setCategoryList] = useState();
    const [categoryData, setCategoryData] = useState();

    useEffect(() => {
        if(_.isEmpty(categoryData)){
            FetchWithoutId(categoryData, setCategoryData, "category");
        }else{
            setCategoryList(categoryData);
        }
    }, [categoryData]);

    if(_.isEmpty(categoryList)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div>}
    else {
        return (
            <div className='div-box' style={{marginLeft: "10px"}}>
                <b style={{ fontSize: "40px"}}> Category Setting </b>
                <Link to={`/category/add`} className="none">
                    <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Add Category </button>
                </Link>
                <Link to={`/board/category/${categoryList.splice(0,1)[0].id}`} className="none">
                    <button className='w3-button w3-border w3-round-xlarge w3-small  w3-hover-deep-purple'> Go to Default </button>
                </Link>
                <hr/>
                {categoryList?.map((category, index) => {
                    return <li key={index}><CategoryDeatilData data={category} /></li>
                })}
            </div>
        ) 
    }
}

function CategoryDeatilData({data}) {
    return (
        <div style={{textAlign: "left"}}>
            <b> ID : </b> <span> {data.id} </span><br/>
            <b> Name : </b><span> {data.name} </span><br/>
            <b> Article : {data.article_cnt} ea </b><br/>
            <Link to={`/board/category/${data.id}`} className="none">
                <button className='w3-button w3-border w3-round-xlarge w3-small  w3-hover-deep-purple'> Go to {data.name} </button>
            </Link>
            <Link to={`/category/edit/${data.id}`} className="none">
                <button className="w3-button w3-border w3-round-xlarge w3-small  w3-hover-teal"> Edit</button>
            </Link>
            <button className="w3-button w3-border w3-round-xlarge w3-small  w3-hover-red" 
                    onClick={() => { Delete("category", data.id) }}> Delete </button>
        </div>
    )
}

export default CategoryDeatil