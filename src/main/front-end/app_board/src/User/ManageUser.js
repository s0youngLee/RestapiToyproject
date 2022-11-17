import React, { useState, useMemo } from "react";
import _ from "lodash";
import { Delete, FetchWithoutId } from "../func";
import axios from "axios";

function UserManage(){
    const manage = Array.from(FetchWithoutId("user/manage").data);
    const editList = useMemo(() => {
        let list = [];
        manage.map((user, index)=> {
            return list.push({
                code : user.code,
                auth : user.auth
            });
        })
        return list;
    }, [manage]);

    function SaveAll(){
        let check = false;
        manage.map((origin, index) => {
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
            // alert("Failed to save all user.");
            alert("유저 정보 변경에 실패했습니다.");
            window.location.reload();
        }else{
            // alert("User auth all changed.");
            alert("변경된 정보가 모두 저장되었습니다.");
            window.location.reload();
        }
    }
    
    if(_.isEmpty(manage)){ return <div style={{marginTop: "100px", textAlign: "center"}}> <b style={{fontSize: "30px"}}>Data Not Found</b> </div>}
    else{
        return (
            <>
            <div className="div-box">
                <b style={{fontSize: "30px"}}> User List </b>
                <table>
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>ID(EMAIL)</th>
                            <th>NAME</th>
                            <th>NICKNAME</th>
                            <th>PHONE</th>
                            <th>AUTH</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manage?.map((userinfo, index) => {
                            return (
                                <EditUser key={index} index={index} userinfo={userinfo} editList={editList}/>
                            )
                        })}
                    </tbody>
                </table>
                <button onClick={() => window.location.href="/mypage"}
                        className="w3-button w3-border w3-round-xlarge w3-small w3-hover-deep-purple"> Go to mypage →</button>
                <button onClick={() => SaveAll()}
                        className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal">Save All</button>
            </div>
            </>
        )
    }
}

function EditUser({index, userinfo, editList}){
    const authList = ["ROLE_USER", "ROLE_ADMIN"];
    const [userAuth, setAuth] = useState(userinfo.auth.split("_")[1]);

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
            alert("User's auth edited.");
            window.location.reload();
        }).catch((e) => {
            alert("Failed to edit auth.\nPlease try again.");
            console.log(e.response);
        })
    }

    return (
        <>
            <tr className="manage" >
                <td>{userinfo.code}</td>
                <td>{userinfo.email}</td>
                <td>{userinfo.name}</td>
                <td>{userinfo.nick_name}</td>
                <td style={{minWidth: "150px"}}>{userinfo.phone}</td>
                <td style={{minWidth: "110px"}}>{userAuth} &nbsp; 
                    <input type={"image"} src={require("../Icon/change.png").default} alt={"icon"}
                        style={{width:"20px", verticalAlign: "middle"}}
                        onClick={() => {changeAuth()}} />
                </td>
                <td style={{textAlign: "left", width: "50px"}}>
                    <button onClick={() => {editAuth()}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-teal"> Save </button>
                </td>
                <td style={{width: "50px"}}>
                    <button onClick={() => {Delete("user",userinfo.code)}} className="w3-button w3-border w3-round-xlarge w3-small w3-hover-red"> Remove </button>
                </td>
            </tr>
        </>
    )
}

export default UserManage;