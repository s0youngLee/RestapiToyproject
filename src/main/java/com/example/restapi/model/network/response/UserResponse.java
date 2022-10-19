package com.example.restapi.model.network.response;

import lombok.Builder;

@Builder
public record UserResponse(Integer code, String email, String auth, String nickName, String name, String phone) {
}
