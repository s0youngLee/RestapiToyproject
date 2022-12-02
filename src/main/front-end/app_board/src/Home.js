import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageviewCount } from "./func";

function Home() {    
    const currentlocation = useLocation();
    useEffect(() => {
        pageviewCount(currentlocation.pathname, "home");
        alert("App_Board 테스트 홈페이지입니다.");
    }, [currentlocation]);

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