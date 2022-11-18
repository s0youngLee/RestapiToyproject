import React, { useState, useMemo, useEffect } from "react";
import _ from "lodash";
import { Delete, FetchWithoutId } from "../func";
import axios from "axios";
import Pagination from "react-js-pagination";

function UserManage(){
    const [manage, setManage] = useState();
    const [userData, setUserData] = useState();

    useEffect(() => {
        if(_.isEmpty(userData)){
            FetchWithoutId(userData, setUserData, "user/manage");
        }else{
            setManage(userData.data);
        }
    }, [userData]);

    const pageLimit = 5; // page display cnt limit
    const userCntPerPage = 3; // article cnt per pages
    const [currentPage, setCurrentPage] = useState(1);
    const offset = (currentPage - 1) * userCntPerPage;
    const usersPerPage = manage?.slice(offset, offset + userCntPerPage);

    const editList = useMemo(() => {
        let list = [];
        usersPerPage?.map((user, index)=> {
            return list.push({
                code : user.code,
                auth : user.auth
            });
        })
        return list;
    }, [usersPerPage]);

    const handlePageChange = (currentPage) => {
        setCurrentPage(currentPage);
    };

    function SaveAll(){
        let check = false;
        usersPerPage.map((origin, index) => {
            console.log(origin.auth);
            console.log(editList[index].auth);
            if(!_.isEqual(origin.auth, editList[index].auth)){
                axios.put(`/user/manage/${origin.code}`, {
                    data : {
                        auth : editList[index].auth
                    }
                }).catch((e) => {
                    check = true;
                    console.log(e.response);
                })
            }
            return null;
        })
        if(check){
            alert("유저 정보 변경에 실패했습니다.");
            window.location.reload();
        }else{
            alert("변경된 정보가 모두 저장되었습니다.");
            window.location.reload();
        }
    }
    
    if(_.isEmpty(manage)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div>}
    else{
        return (
            <>
            <div className="div-box" style={{marginLeft: "10px"}}>
                <b style={{fontSize: "30px"}}> User List </b>
                {usersPerPage?.map((userinfo, index) => {
                    return (
                        <EditUser key={index} index={index} userinfo={userinfo} editList={editList}/>
                    )
                })}
                <button onClick={() => window.location.href="/mypage"}
                        className="w3-button w3-border w3-round-xlarge w3-small w3-hover-deep-purple"> Go to mypage →</button>
                <button onClick={() => SaveAll()}
                        className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal">Save All</button>
                <br/>
                <Pagination
                    activePage={currentPage} 
                    itemsCountPerPage={userCntPerPage} 
                    totalItemsCount={manage.length} 
                    pageRangeDisplayed={pageLimit} 
                    onChange={handlePageChange}
                    innerClass={"paginate"}
                    activeClass={"w3-button w3-round-xxlarge w3-small w3-deep-purple"}
                    itemClass={"w3-button w3-round-xxlarge w3-small w3-hover-deep-purple"}
                    linkClass={"none"}
                />
            </div>
            </>
        )
    }
}

function EditUser({index, userinfo, editList}){
    const authList = ["ROLE_USER", "ROLE_ADMIN"];
    const [userAuth, setAuth] = useState("click to change");
    const [visible, setVisible] = useState(false);
    
    function changeAuth(){
        if(_.isEqual(userAuth, "USER")){
            setAuth(authList[1].split("_")[1]);
            if(_.isEqual(editList[index].code, userinfo.code)){
                editList[index] = {
                    code : userinfo.code,
                    auth :"ROLE_" + authList[1].split("_")[1]
                }
            }
        }else{
            setAuth(authList[0].split("_")[1]);
            if(_.isEqual(editList[index].code, userinfo.code)){
                editList[index] = {
                    code : userinfo.code,
                    auth :"ROLE_" + authList[0].split("_")[1]
                }
            }
        }
    }
    
    function editAuth(){
        axios.put(`/user/manage/${userinfo.code}`, {
            data : {
                auth : "ROLE_" + userAuth
            }
        }).then(() => {
            console.log("ROLE_" + userAuth);
            alert("User " + userinfo.name + "'s auth edited.");
            window.location.reload();
        }).catch((e) => {
            alert("Failed to edit auth.\nPlease try again.");
            console.log(e.response);
        })
    }

    return (
        <li style={{padding: "5px"}} onClick={() => setVisible(!visible)}>
            <p className="p-user"> 
                번호 : <b className="b-user">{userinfo.code}</b> <br/>
                아이디 : <b className="b-user"> {userinfo.email} </b> <br/>
                이름 : <b className="b-user"> {userinfo.name} </b>
                닉네임 : <b className="b-user"> {userinfo.nick_name} </b><br/>
                전화번호 : <b className="b-user"> {userinfo.phone} </b><br/>
                권한 : <b className="b-user"> {userinfo.auth.split("_")[1]} → {userAuth} </b> &nbsp;
                    <input type={"image"} src={require("../Icon/change.png").default} alt={"icon"}
                        style={{width:"20px", verticalAlign: "middle"}}
                        onClick={() => {changeAuth()}} /><br/>
                <button onClick={() => {editAuth()}} className="w3-button w3-border w3-round-xlarge w3-tiny w3-hover-teal"> 저장 </button>
                <button onClick={() => {Delete("user",userinfo.code)}} className="w3-button w3-border w3-round-xlarge w3-tiny w3-hover-red"> 삭제 </button>
            </p>
        </li>
    )
}

export default UserManage;