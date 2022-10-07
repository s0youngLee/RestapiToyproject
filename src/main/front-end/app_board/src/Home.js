import {Link} from 'react-router-dom';

const Home = () => {
    return(
        <div id="home">
            <h1> Home Page </h1>
            <p> App_Board Front Tutorial </p>

            {/*  사용자별 로그인 구현 후, 로그인이 되어있으면 signout으로 보이게, 아니라면 signin으로 보이게 설정 / signout 일 경우 로그아웃 호출
                <Link to="/login"><button id="btn-default" style={{width: "100px", height: "50px"}}> Sign in </button></Link> <br/><br/> 
            */}

            <Link to="/board"><button id="btn-default"> Board </button></Link>
            <Link to="/category"><button id="btn-default"> Category </button></Link>

            <br/><br/><br/>
        </div>
    );
};

export default Home;