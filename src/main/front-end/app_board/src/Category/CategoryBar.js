import {Link} from 'react-router-dom';
import '../App.css'

function CategoryBar({category}){
    const categoryList = category;
    // console.log(categoryList);
   
    return (
        <>
            <h1 style={{color: "#373737", textAlign:"center"}}> Category List </h1> 
            <div style={{margin: "10px", textAlign: "center", borderBottom: "1px solid #373737"}}>
                {categoryList?.map((category, index) => (
                    <Link to={`/board/category/${category.id}`} id="none" key={index}> 
                        <button id="btn-category"> {category.name} </button>
                    </Link>
                ))}
                <br/><br/>
            </div>
        </>
    )
}

export default CategoryBar;