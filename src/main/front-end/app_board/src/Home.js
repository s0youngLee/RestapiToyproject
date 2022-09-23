import React from "react";
import {Link} from 'react-router-dom';

const Home = () => {
    return(
        <div id="home">
            <h1> Home Page </h1>
            <p> App_Board Front Tutorial </p>

            <Link to="/board"><button id="btn-detail"> Board </button></Link>
        </div>
    );
};

export default Home;