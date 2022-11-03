import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import 'w3-css';
import { FetchWithoutId, isAdmin } from "./func";

function Bar({isLogin, user}) {
    const categoryList = Array.from(FetchWithoutId("category").data);

    const [searchParam, setSearchParam] = useState("");

    const handleParam = useCallback(e => {
        setSearchParam(e.target.value);
    }, []);

    const searchArticle = (e) => {
        e.preventDefault();
        if(!_.isEmpty(searchParam)){
            setSearchParam(searchParam);
        }
        window.location.href = `/search/${searchParam}`;
    }

    function Logout() {
        if (window.confirm("Wanna logout?")){
            sessionStorage.removeItem("isLogin");
            axios.post('/logout');
            window.location.replace('/');
        }
    };
    return ( 
        <>
            <div className="w3-top">
                <div className="w3-bar w3-large" style={{backgroundColor:"#cab6ff"}}>
                    <Link to={'/'} className="none"><button className="w3-bar-item w3-button w3-hover-deep-purple" >Home</button></Link>
                    <Link to={'/board'} className="none"><button className="w3-bar-item w3-button w3-hover-deep-purple">Board</button></Link>
                        
                    <div className="w3-dropdown-hover">
                        <button className="w3-button w3-hover-deep-purple">Category</button>
                        <div className="w3-dropdown-content w3-bar-block w3-border">
                            {categoryList?.map((category, index) => (
                                <button key={index} className="w3-bar-item w3-button"
                                        onClick={() => {window.location.href = `/board/category/${category.id}`}}> {category.name} </button>
                                ))}
                        </div>
                    </div>
                    {isAdmin(user?.auth) &&
                        <Link to={"/category"} className="none"><button className="w3-bar-item w3-button w3-hover-red">Setting</button></Link>
                    }

                    <form onSubmit={searchArticle} style={{width: "45vh", display: "inline-block"}}>
                        <input type="text" style={{width: "90%", margin: "0", marginRight: "5px"}} 
                               placeholder="Please enter your keyword(s) to search." name="search" onChange={handleParam} required/>
                        <input type={"image"} src={require("./search.png").default} alt={"icon"}
                            style={{width:"30px", height:"30px", objectFit: "fill", verticalAlign: "middle"}} />
                    </form>
                    {!isLogin && <Link to={'/login'} className="none"><button className="w3-bar-item w3-button w3-hover-deep-purple w3-right">Login</button></Link>}
                    {isLogin && <Link to={'/mypage'} className="none"><button className="w3-bar-item w3-button w3-hover-deep-purple w3-right">MyPage</button></Link>}
                    {isLogin && <button className="w3-bar-item w3-button w3-hover-red w3-right"
                        onClick={() => Logout()}>Logout</button>}
                </div>
            </div>
        </>
    );
}

export default Bar;