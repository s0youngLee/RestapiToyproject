package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record UserResponseDto(Integer code, String email, String auth, String nickName, String name, String phone) {
}
