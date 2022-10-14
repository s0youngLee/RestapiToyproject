import {Link} from 'react-router-dom';
import { isLogin } from './func';

const Home = () => {
    return(
        <div id="home">
            <h1> Home Page </h1>
            <p> App_Board Front Tutorial </p>

            <Link id='none' to="/board"><button id="btn-default"> Board </button></Link>

            <Link id="none" to={`/login`}>
                <button id="btn-default" style={isLogin() ? {display : "none"} : {right: "10px"}}> Login </button>
            </Link>
            <form action="/userlogin?logout" method="post">
                <button style={isLogin() ? {right: "10px"} : {display : "none"}} type="submit" id="btn-default"
                        onClick={() => sessionStorage.removeItem('username')} > Logout </button>
            </form>

            <br/><br/><br/>
        </div>
    );
};

export default Home;