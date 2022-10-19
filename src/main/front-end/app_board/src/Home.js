import axios from 'axios';
import {Link} from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Home({isLogin}) {
    const [, , removeCookie] = useCookies(['isLogin']);
    function Logout() {			
        axios.post('/logout');	
        removeCookie(['isLogin']);
        window.location.replace('/');   
    };
    
    return(
        <div id="home">
            <h1> Home Page </h1>
            <p> App_Board Front Tutorial </p>

            <Link id='none' to="/board"><button id="btn-default"> Board </button></Link>

            <Link id="none" to={`/login`}>
                <button id="btn-default" style={isLogin ? {display : "none"} : {right: "10px"}}> Login </button>
            </Link>
            <button style={isLogin ? {right: "10px"} : {display : "none"}} id="btn-default"
                    onClick={() => Logout()} > Logout </button>
            <br/><br/><br/>
        </div>
    );
};

export default Home;