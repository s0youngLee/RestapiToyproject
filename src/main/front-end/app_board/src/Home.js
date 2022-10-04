import React from "react";
import {Link} from 'react-router-dom';

const Home = () => {
    return(
        <div id="home">
            <h1> Home Page </h1>
            <p> App_Board Front Tutorial </p>

            <Link to="/member"><button id="btn-default" style={{width: "100px", height: "50px"}}> Sign in </button></Link> <br/><br/>

            <Link to="/board"><button id="btn-default"> Board </button></Link>
            <Link to="/category"><button id="btn-default"> Category </button></Link>
        </div>
    );
};

export default Home;