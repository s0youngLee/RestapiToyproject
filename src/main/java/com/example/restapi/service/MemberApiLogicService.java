package com.example.restapi.service;

import org.springframework.stereotype.Service;

import com.example.restapi.controller.AbstractCrudMethod;
import com.example.restapi.model.entity.Member;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.MemberRequest;
import com.example.restapi.model.network.response.MemberResponseDto;
import com.example.restapi.repository.MemberRepository;

@Service
public class MemberApiLogicService extends AbstractCrudMethod<MemberRequest, MemberResponseDto> {
	private final MemberRepository memberRepository;
	// private final PasswordEncoder passwordEncoder;

	public MemberApiLogicService(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
		// this.passwordEncoder = passwordEncoder;
	}

	//signUp (회원가입)
	@Override
	public Header<MemberResponseDto> create(Header<MemberRequest> request) {
		MemberRequest body = request.getData();

		Member member = Member.builder()
			.id(body.getId())
			.memberId(body.getMemberId())
			.password(body.getPassword())
			.userName(body.getUserName())
			.build();

		return response(memberRepository.save(member));
	}

	//withdraw (회원탈퇴)
	@Override
	public Header delete(int id) {
		return memberRepository.findById(id)
			.map(member -> {
				memberRepository.delete(member);
				return Header.OK();
			})
			.orElseGet(() -> Header.ERROR("No DATA"));
	}

	//마이페이지
	@Override
	public Header<MemberResponseDto> read(int id){
		return memberRepository.findById(id)
			.map(this::response)
			.orElseGet(() -> Header.ERROR("No DATA"));
	}

	//회원정보 수정
	@Override
	public Header<MemberResponseDto> update(Header<MemberRequest> request, int id){
		MemberRequest body = request.getData();

		return memberRepository.findById(id)
			.map(member -> {
				member.setPassword(body.getPassword());
				member.setUserName(body.getUserName());
				return member;
			})
			.map(memberRepository::save)
			.map(this::response)
			.orElseGet(() -> Header.ERROR("No DATA"));
	}

	private Header<MemberResponseDto> response(Member member) {
		MemberResponseDto newMember = MemberResponseDto.builder()
			.memberId(member.getMemberId())
			.userName(member.getUserName())
			.password(member.getPassword())
			.build();

		return Header.OK(newMember);
	}


	// login form exercise
	// public Header<MemberResponseDto> logIn(Header<MemberRequest> request) {
	// 	MemberRequest body = request.getData();
	//
	// 	MemberResponseDto loginToken = MemberResponseDto.builder()
	// 		.memberId(body.getMemberId())
	// 		.userName(body.getUserName())
	// 		.password(passwordEncoder.encode(body.getPassword()))
	// 		.build();
	// 	return Header.OK();
	// }

}

