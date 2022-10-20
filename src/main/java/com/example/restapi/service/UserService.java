package com.example.restapi.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.context.annotation.Lazy;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {
	private final UserRepository userRepository;
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);

	public UserService(@Lazy UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		final UserInfo user = userRepository.findByEmail(email);
		if(user == null) {
			throw new UsernameNotFoundException(email + " doesn't exist.");
		}
		return user;
	}

	public String phone_format(String number) {
		String regEx = "(\\d{3})(\\d{3,4})(\\d{4})";
		return number.replaceAll(regEx, "$1-$2-$3");
	}

	public Header<UserResponseDto> userPage(UserInfo user) {
		return Header.OK(buildUser(user));
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

	public Header<UserInfo> register(Header<UserRequest> infoDto) {
		UserRequest body = infoDto.getData();

		UserInfo user = UserInfo.builder()
			.email(body.getEmail())
			.password(encoder.encode(body.getPassword()))
			.auth(body.getAuth())
			.nickName(body.getNickName())
			.name(body.getName())
			.phone(phone_format(body.getPhone()))
			.build();

		return Header.OK(userRepository.save(user));
	}

	public Header<UserInfo> changePassword(Integer code, Header<UserRequest> request) {
		UserRequest body = request.getData();
		UserInfo user = userRepository.getReferenceById(code);

		user.setPassword(encoder.encode(body.getPassword()));
		return Header.OK(userRepository.save(user));
	}



	public Header<UserInfo> changeAuth(String auth, Header<UserRequest> request, Integer code) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			UserRequest body = request.getData();
			UserInfo user = userRepository.getReferenceById(code);

			user.setAuth(body.getAuth());
			return Header.OK(userRepository.save(user));
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}


	public Header deleteUser(int code) {
		return userRepository.findById(code)
			.map(delUser -> {
				userRepository.delete(delUser);
				return Header.OK();
			}).orElseGet(() -> Header.ERROR("No DATA"));
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
