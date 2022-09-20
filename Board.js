// Youtube 김나비다

import React, { useState, Component, Fragment } from 'react';

class Board extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            menu1: this.props.menu1,
            menu2: this.props.menu2,
            boardType: this.props.boardType,
            boardData: {
                id: '',
                category: '',
                title: '',
                contents: '',
                createdId: '',
                createdAt: '',
                visitCnt: '',
                comment : {
                    id: '',
                    content: '',
                    createdAt: ''
                }
            }
        }

        //리스트 불러오기 성공하면 게시판 형태 바꾸기 - 현재 형태는 게시글 상세에서 보이도록하고, 수정 폼이 아니라 댓글 작성폼으로 수정할것
        // /board에서의 형태는 카톡 사진 참고
        this.menuClick = this.menuClick.bind(this);
        this.menuClick2 = this.menuClick2.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleCreate2 = this.handleCreate2.bind(this);
    }

    componentDidMount(){
        console.log('===Board componentDidMount:'+this.props.boardType);
        this._ismounted = true;

        if( this.props.boardType === 'board' ){
            this.setState({
                menu1: true,
                menu2: false,
            });
        }else{
            this.setState({
                menu1: false,
                menu2: true,
            });
        }
    }

    componentWillUnmount() {
        console.log('===Board componentWillUnmount');
        this._ismounted = false;
    }

    menuClick() {
        fetch('/board')
        .then(response => response.text())
        .then(data => {            

            this.setState({
                menu1: true,
                menu2: false,
                boardType: data,
            }, () => this.props.onCreate(this.state) );
        });
    }

    menuClick2() {
        fetch('/category')
        .then(response => response.text())
        .then(data => {            

            this.setState({
                menu1: false,
                menu2: true,
                boardType: data,
            }, () => this.props.onCreate(this.state) );
        });
    }

    handleCreate(data) {

        if( this._ismounted ){
            this.setState({
                boardData: data.boardData
            });
        }
    }

    handleCreate2(data) {

        if( this._ismounted ){
            this.setState({
                boardData: {id: this.state.boardData.id, title: this.state.boardData.title, contents: this.state.boardData.contents, date: this.state.boardData.date}
            });
        }
    }

    render() {
        return (
            <div className="card">
                <h1>SpringBoot + REACT</h1>
                <div className="card-header">
                    <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className={"nav-link " + (this.state.menu1 ? 'active' : '')} onClick={this.menuClick}>Article List</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (this.state.menu2 ? 'active' : '')} onClick={this.menuClick2}>Category List</a>
                    </li>
                    </ul>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-4">
                            <List key={this.state.boardType} boardType={this.state.boardType} onCreate={this.handleCreate} />
                        </div>
                        <div className="col-lg-5">
                            <Detail key={this.state.boardType+this.state.boardData.id} id={this.state.boardData.id} title={this.state.boardData.title} contents={this.state.boardData.contents} date={this.state.boardData.date} boardType={this.state.boardType} onCreate={this.handleCreate2} />
                        </div>
                    </div>
                </div>
                <div className="card-footer">SpringBoot + MySQL + <strong>REACT</strong> + bootstrap4 _ YOUTUBE(KimNaBiDa)</div>
            </div>
        );
    }
}

class List extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            boardList: [],
            boardData: {
                id: '',
                title: '',
                contents: ''
            }
        }

        this.setBoardData = this.setBoardData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    componentDidMount(){
        // console.log('===List componentDidMount');
        this._isMounted = true;

        fetch('/board')
        .then(response => response.json())
        .then(data => {            
            let boardData = {};
            for(var i=0; i<data.length; i++){
                var contents = data[i].contents;

                if( i === 0 ){

                    boardData = {id: data[i].id, title: data[i].title, contents: contents, date: data[i].date};

                    this.setState({
                        boardData: boardData
                    }, () => this.setBoardData() );
                }
            }

            // const boardList = data[i].map(article => (
            //     <ListData key={article.id} id={article.id} title={article.title} contents={article.contents} date={article.date} onCreate={this.handleCreate} />
            // ));

            // this.setState({
            //     boardList: boardList
            // });
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    setBoardData(){
        this.props.onCreate(this.state);
    }

    handleCreate(data) {

        if( this._isMounted ){
            this.setState({
                boardData: data.boardData
            }, () => this.props.onCreate(this.state) );
        }
    }

    render() {
        const divStyle = {
            minHeight: '500px',
            maxHeight: '500px',
            overflowY: 'auto'
        };

        return (
            <div className="card" style={divStyle}>
                <table className="table">
                    <thead>
                        <tr>
                        <th>List</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.boardList}
                    </tbody>
                </table>
            </div>
        );
    }
}

class ListData extends Component {  

    constructor(props) {
        super(props);
        this._ismounted = false;
        this.state = {
            boardData: {
                id: '',
                title: '',
                contents: ''
            }
        }

        this.setDetail = this.setDetail.bind(this);
    }

    componentDidMount(){
        this._ismounted = true;

        /* this.setState({
            boardData: {id: this.props.id, title: this.props.title, contents: this.props.contents, date: this.props.date, fname: this.props.fname}
        }, () => this.props.onCreate(this.state) ); */
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    setDetail(){
        if( this._ismounted ){
            this.setState({
                boardData: {id: this.props.id, title: this.props.title, contents: this.props.contents, date: this.props.date}
            }, () => this.props.onCreate(this.state) );
        }
    }

    render() {
        const lineStyle = {
            float: 'right',
        };

        return (
            <tr onClick={this.setDetail}>
                <td>{this.props.title}<span style={lineStyle}>{this.props.date}</span></td>
            </tr>            
        );
    }
}

class Detail extends Component {
    constructor(props) {
        super(props);
        this._ismounted = false;
        this.state = {
            id: '',
            title: '',
            contents: ''
        }

        this.idRef = React.createRef();
        this.titleRef = React.createRef();
        this.contentsRef = React.createRef();

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.del = this.del.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        console.log('===Detail componentDidMount');
        this._ismounted = true;

        if( this.props.title !== undefined && this.props.title !== '' ){
            
            if( this._ismounted ){
                this.setState({
                    id: this.props.id,
                    title: this.props.title,
                    contents: this.props.contents
                });
            }
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    save(e) {
        if( this.props.title !== undefined && this.props.title !== '' ){

            if( !window.confirm("저장하시겠습니까?") ){
                return;
            }
            
            let formData = new FormData();
            formData.append('id', this.idRef.current.value);
            formData.append('title', this.titleRef.current.value);
            formData.append('contents', this.contentsRef.current.value);

            
            let url = "/add";
            if( this.props.boardType === 'board' ){
                if( this.idRef.current.value !== '' ){                
                    url = "/mod";
                }
            }else if( this.props.boardType === 'board2' ){
                url = "/add2";
                if( this.idRef.current.value !== '' ){                
                    url = "/mod2";
                }
            }

            fetch(url, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    //"content-type": "multipart/form-data"
                },
                body: formData
              })
            .then(response => response.json())
            .then(data => {            
                
                if(data.returnCode === 'success'){
                    window.location.reload();
                }else{
                    window.alert(data.returnDesc);
                }
            });
        }
    }

    cancel(e) {
        if( this.props.title !== undefined && this.props.title !== '' ){

            this.setState({
                id: '',
                title: '',
                contents: ''
            }, () => this.props.onCreate(this.state) );
        }
    }

    del(e) {
        if( this.props.title !== undefined && this.props.title !== '' ){

            if( this.idRef.current.value === '' ){
                window.alert("ERROR : No Data to delete");
                return;
            }
            if( !window.confirm("Delete?") ){
                return;
            }
            
            let formData = new FormData();
            formData.append('id', this.idRef.current.value);
            formData.append('title', this.titleRef.current.value);
            formData.append('contents', this.contentsRef.current.value);
            
            fetch('/del', {
                method: 'POST',
                headers: {
                },
                body: formData
              })
            .then(response => response.json())
            .then(data => {            
                
                if(data.returnCode === 'success'){
                    window.location.reload();
                }else{
                    window.alert(data.returnDesc);
                }
            });
        }
    }

    handleChange(){
        if( this._ismounted ){
            this.setState({
                id: this.idRef.current.value,
                title: this.titleRef.current.value,
                contents: this.contentsRef.current.value,
            });
        }
    }


    render() {

        const divStyle = {
            minHeight: '500px',
            maxHeight: '1000px'
        };
        const divCenter = {
            textAlign: 'center',
        };

        return (
            <div className="card bg-light text-dark" style={divStyle}>
                <form name="form1" action="">
                    <div className="form-group">
                    <label className="control-label">Title:</label>
                    <div>
                        <input type="text" ref={this.titleRef} className="form-control" placeholder="Input title" onChange={this.handleChange} value={this.state.title} />
                    </div>
                    </div>
                    <div className="form-group">
                    <label className="control-label">  Content:</label>
                    <div> 
                        <textarea className="form-control" ref={this.contentsRef} rows="10" onChange={this.handleChange} value={this.state.contents}></textarea>
                    </div>
                    </div>
                    <input type="hidden" ref={this.idRef} name="id" value={this.state.id} />
                </form>
                <div style={divCenter}>
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                        <button type="button" className="btn btn-secondary" onClick={this.cancel}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={this.del}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}


export default Board;