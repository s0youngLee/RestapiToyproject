import {Link} from 'react-router-dom';

const Home = () => {
    return(
        <div id="home">
            <h1> Home Page </h1>
            <p> App_Board Front Tutorial </p>

            {/*  사용자별 로그인 구현 후, 로그인이 되어있으면 Logout 보이게, 아니라면 Login 보이게 설정 / Logout 일 경우 로그아웃 호출*/}

            <Link id='none' to="/board"><button id="btn-default"> Board </button></Link>
            <Link id='none' to="/login"><button id="btn-default"> Login </button></Link>

            <br/><br/><br/>
        </div>
    );
};

export default Home;