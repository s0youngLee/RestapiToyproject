import { Link } from "react-router-dom";
import axios from "axios";
import 'w3-css';
import { FetchWithoutId, isAdmin } from "./func";

function Bar({isLogin, user, removeCookie}) {
    const categoryList = Array.from(FetchWithoutId("category").data);
    function Logout() {			
        removeCookie(['isLogin'], {path:"/"});
        axios.post('/logout');
        window.location.replace('/');
    };
    return (
        <>
            <div className="w3-top">
                <div className="w3-bar w3-large" style={{backgroundColor:"#cab6ff"}}>
                    <Link to={'/'} className="w3-bar-item w3-button w3-hover-blue">Home</Link>
                    <Link to={'/board'} className="w3-bar-item w3-button w3-hover-blue">Board</Link>
                        
                    <div className="w3-dropdown-hover">
                        <button className="w3-button w3-hover-blue">Dropdown</button>
                        <div className="w3-dropdown-content w3-bar-block w3-border">
                            {categoryList?.map((category, index) => (
                                <button key={index} className="w3-bar-item w3-button"
                                        onClick={() => {window.location.replace(`/board/category/${category.id}`)}}> {category.name} </button>
                                ))}
                        </div>
                    </div>

                    {!isLogin && <Link to={'/login'} className="w3-bar-item w3-button w3-hover-blue w3-right">Login</Link>}
                    {isLogin && <Link to={'/mypage'} className="w3-bar-item w3-button w3-hover-blue w3-right">MyPage</Link>}
                    {isLogin && <button className="w3-bar-item w3-button w3-hover-red w3-right"
                        onClick={() => Logout()}>Logout</button>}
                    {isAdmin(user?.auth) &&
                        <Link to={"/category"} className="w3-bar-item w3-button w3-hover-red">Setting</Link>
                    }
                </div>
            </div><br/><br/>
        </>
    );
}

export default Bar;