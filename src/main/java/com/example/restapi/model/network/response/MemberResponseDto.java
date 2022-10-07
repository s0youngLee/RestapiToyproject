package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record MemberResponseDto(String memberId, String password, String userName){
}