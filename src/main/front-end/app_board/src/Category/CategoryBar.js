import {Link} from 'react-router-dom';
import * as Function from "../func";
import '../App.css'

function CategoryBar(){
    const categoryList = Function.Fetching("category", 1);
   
    return (
        <div style={{margin: "10px", textAlign: "center", borderBottom: "1px solid #373737", whiteSpace: "nowrap"}}>
            <b style={{color: "#373737", fontSize: "30px", verticalAlign: "middle"}}> Category : </b> 
            {categoryList?.map((category, index) => (
                <Link to={`/board/category/${category.id}`} id="none" key={index}> 
                    <button id="btn-category"> {category.name} </button>
                </Link>
            ))}
            {/* 로그인 되어있으면 카테고리 관리 버튼 나오게 만들기, 안되어있으면 hidden 처리 : 현재는 일단 보이게 설정 (권한 설정은 security에서 함) 
                style={{display: "none"}} */}
            <Link id='none' to={"/category"}><button id='btn-remove'> Setting </button></Link>
            <br/><br/>
        </div>
    )
}

export default CategoryBar;