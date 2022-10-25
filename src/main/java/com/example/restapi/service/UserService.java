package com.example.restapi.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.repository.UserRepository;
import com.example.restapi.security.MadeLogoutHandler;

@Service
public class UserService {
	private final UserRepository userRepository;
	Logger logger = LoggerFactory.getLogger(MadeLogoutHandler.class);
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	public UserService(@Lazy UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public String phone_format(String number) {
		String regEx = "(\\d{3})(\\d{3,4})(\\d{4})";
		return number.replaceAll(regEx, "$1-$2-$3");
	}

	public Status<UserResponseDto> userPage(UserInfo user) {
		return Status.OK(buildUser(user));
	}

	public List<UserResponseDto> userList(String auth) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			List<UserResponseDto> responseList = new ArrayList<>();
			for(UserInfo userInfo : userRepository.findAll()){
				responseList.add(buildUser(userInfo));
			}
			return responseList;
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}

	public Status<UserInfo> register(Status<UserRequest> infoDto) {
		UserRequest body = infoDto.getData();
		UserInfo user = UserInfo.builder()
				.email(body.getEmail())
				.password(encoder.encode(body.getPassword()))
				.auth(body.getAuth())
				.nickName(body.getNickName())
				.name(body.getName())
				.phone(phone_format(body.getPhone()))
				.build();

		return Status.OK(userRepository.save(user));
	}

	public Status<UserInfo> changePassword(Integer code, Status<UserRequest> request) {
		UserRequest body = request.getData();
		UserInfo user = userRepository.getReferenceById(code);

		user.setPassword(encoder.encode(body.getPassword()));
		return Status.OK(userRepository.save(user));
	}



	public Status<UserInfo> changeAuth(String auth, Status<UserRequest> request, Integer code) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			UserRequest body = request.getData();
			UserInfo user = userRepository.getReferenceById(code);

			user.setAuth(body.getAuth());
			return Status.OK(userRepository.save(user));
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}


	public Status deleteUser(int code) {
		return userRepository.findById(code)
			.map(delUser -> {
				userRepository.delete(delUser);
				return Status.OK();
			}).orElseGet(() -> Status.ERROR("No DATA"));
	}


	public UserResponseDto buildUser(UserInfo user){
		return UserResponseDto.builder()
			.code(user.getCode())
			.email(user.getEmail())
			.name(user.getName())
			.nickName(user.getNickName())
			.phone(user.getPhone())
			.auth(user.getAuth())
			.build();
	}

}
