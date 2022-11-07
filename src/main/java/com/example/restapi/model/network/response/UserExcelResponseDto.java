package com.example.restapi.model.network.response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;

@Builder
public record UserExcelResponseDto(Integer code, String email, String auth, String nickName, String name, String phone, LocalDateTime lastAccess) {
	public List<String> getData(){
		List<String> data = new ArrayList<>();
		data.add(code.toString());
		data.add(email);
		data.add(auth.substring(5));
		data.add(nickName);
		data.add(name);
		data.add(phone);
		data.add(lastAccess.format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss")));
		return data;
	}
}