function PageNotFound() {
    return (
        <div className="div-box">
            <b style={{fontSize: "50px"}}> Page Not Found </b><hr/>
            <b style={{fontSize: "25px"}}>
                SORRY, the page {window.location.pathname} does not exist. <br/>
                Please get back to Home page <br/>
            </b>
        </div>
    )
}

export default PageNotFound;