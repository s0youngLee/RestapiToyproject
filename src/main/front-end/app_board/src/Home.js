import { useEffect } from "react";

function Home() {    
    useEffect(() => {
        alert("App_Board 테스트 홈페이지입니다.");
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