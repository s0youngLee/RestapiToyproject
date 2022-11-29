package com.example.restapi.model.network.request;

import org.springframework.lang.Nullable;

import lombok.Builder;

@Builder
public class UserRequest {
	private String email;
	@Nullable
	private String password;
	private String auth;
	private String nickName;
	private String name;
	private String phone;

	public String getNickName() {
		return nickName;
	}

	public String getName() {
		return name;
	}

	public String getPhone() {
		return phone;
	}
	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public String getAuth() {
		return auth;
	}
}
