import { Link } from "react-router-dom";

function Bar() {
    return (
        <>
            <div style={{height: "80px", textAlign: "center", backgroundColor: "#aa9dff"}}>
                <b style={{color: "#373737", fontSize: "45px", verticalAlign: "middle"}}> Board </b> 
            </div>
            <Link id="none" to="/member"> 
                <button id="btn-default" style={{float: "right", width: "100px", height: "40px"}}> Sign In </button>
            </Link>
        </>
    );
}

export default Bar;