import {Link} from 'react-router-dom';
import { Delete, FetchWithoutId }from '../func';

function CategoryDeatil () {
    const categoryList = Array.from(FetchWithoutId("category").data);

    if(!categoryList){ return <div> Loading ... </div>}
    else {
        return (
            <div style={{margin: "10px"}}>
                <b style={{ fontSize: "40px"}}> Category Setting </b><hr/>
                {categoryList?.map((category, index) => {
                    return <li key={index}><CategoryDeatilData data={category} /></li>
                })}
                <Link to={`/category/add`} id="none"> <button className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Add Category </button></Link>
            </div>
        ) 
    }
}

function CategoryDeatilData({data}) {
    return (
        <>
        <div>
            <b> ID : </b> <span> {data.id} </span><br/>
            <b> Name : </b><span> {data.name} </span><br/>
            <b> Article : {data.article_cnt} ea </b><br/>
        </div>
        <div>
            <Link to={`/board/category/${data.id}`} id="none">
                <button className='w3-button w3-border w3-round-xlarge w3-small  w3-hover-deep-purple'> Go to {data.name} </button>
            </Link>
            {(data.id !== 0) && <>
            <Link to={`/category/edit/${data.id}`} id="none">
                <button className="w3-button w3-border w3-round-xlarge w3-small  w3-hover-teal"> Edit</button>
            </Link>
            <button className="w3-button w3-border w3-round-xlarge w3-small  w3-hover-red" 
                    onClick={() => { Delete("category", data.id) }}> Delete </button>
            </>}
        </div>
        </>
    )
}

export default CategoryDeatil