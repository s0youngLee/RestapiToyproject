package com.example.restapi.controller;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.network.request.MemberRequest;
import com.example.restapi.model.network.response.MemberResponseDto;
import com.example.restapi.service.MemberApiLogicService;

@RestController
@RequestMapping("/member")
public class MemberController extends AbstractCrudMethod<MemberRequest,MemberResponseDto>{
	private final MemberApiLogicService memberApiLogicService;
	public MemberController(@Lazy MemberApiLogicService memberApiLogicService) {
		this.memberApiLogicService = memberApiLogicService;
	}

	@PostConstruct
	public void init(){
		this.baseService = memberApiLogicService;
	}
	
	// create == signup (회원가입)
	// delete == withdraw (회원탈퇴)
	// read == user info (마이페이지)
	// update == edit user info(pw, name)(회원정보 수정)


	// @PostMapping("/login")
	// public Header logIn(@RequestBody Header<Member> request){
	// 	return memberApiLogicService.logIn(request);
	// }

	// @GetMapping("/logout")
	// public Header<Member> logOut(){
	// 	return memberApiLogicService.logOut();
	// }
}
