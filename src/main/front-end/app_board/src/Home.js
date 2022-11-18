import {useEffect} from "react";

function Home() {

    useEffect(() => {
        alert("어서오세요!");
    }, []);

    return(
        <div style={{marginTop: "100px", textAlign: "center"}}>
            <b style={{ fontSize: "40px"}}> Home Page </b>
            <p> 
                App_Board Tutorial <br/>
                Java Spring boot / React.js / MySQL Workbench
            </p>
        </div>
    );
};

export default Home;