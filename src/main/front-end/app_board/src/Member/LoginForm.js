import "../App.css";

function LoginForm(){
    return (
        <div className="container">
            <br/>
            <form className="form-signin" method="post" action="/login">
                <h2 className="form-signin-heading">Please sign in</h2>
                <p>
                    <label htmlFor="username" className="sr-only">User ID</label>
                    <input type="text" id="username" name="username" className="form-control" placeholder="ID" required autoFocus/>
                </p>
                <p>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input type="password" id="password" name="password" className="form-control" placeholder="PW" required/>
                </p>
                    <input name="_csrf" type="hidden" value="af226a34-6934-4e3b-b60d-dfe50903a34a" />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        </div>
    )
}

export default LoginForm;