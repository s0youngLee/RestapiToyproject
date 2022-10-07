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
	
	// create == signup (member 데이터 추가)
	// delete == withdraw (member 데이터 삭제)
	// read == user info (member 데이터 정보)
	// update == edit user info(pw, name)(member 데이터 수정)

	// @GetMapping("")
	// public String loginPage(){
	// 	return "Login Page";
	// }

	// @PostMapping("/login")
	// public Header<MemberResponseDto> logIn(@RequestBody Header<MemberRequest> request) {
	// 	return memberApiLogicService.logIn(request);
	// }

	// @PostMapping("/logout")
	// public Header<Member> logOut(){
	// 	return memberApiLogicService.logOut();
	// }
}
