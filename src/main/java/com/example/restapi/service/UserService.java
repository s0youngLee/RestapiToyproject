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
import com.example.restapi.model.network.response.UserResponse;
import com.example.restapi.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);

	public UserService(@Lazy UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public String phone_format(String number) {
		String regEx = "(\\d{3})(\\d{3,4})(\\d{4})";
		return number.replaceAll(regEx, "$1-$2-$3");
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		final UserInfo user = userRepository.findByEmail(email);
		if(user == null) {
			throw new UsernameNotFoundException(email + " doesn't exist.");
		}
		return user;
	}

	public UserInfo buildUser(UserInfo user){
		return UserInfo.builder()
			.code(user.getCode())
			.email(user.getEmail())
			.password(user.getPassword())
			.auth(user.getAuth())
			.nickName(user.getNickName())
			.name(user.getName())
			.phone(phone_format(user.getPhone()))
			.build();
	}

	public Integer register(Header<UserRequest> infoDto) {
		UserRequest body = infoDto.getData();

		UserInfo user = UserInfo.builder()
			.email(body.getEmail())
			.password(encoder.encode(body.getPassword()))
			.auth(body.getAuth())
			.nickName(body.getNickName())
			.name(body.getName())
			.phone(phone_format(body.getPhone()))
			.build();

		userRepository.save(user);

		return user.getCode();
	}

	public Header<UserInfo> changePassword(Integer code, Header<UserRequest> request) {
		UserRequest body = request.getData();

		return userRepository.findById(code)
			.map(user -> {
				user.setEmail(body.getEmail());
				user.setName(body.getName());
				user.setNickName(body.getNickName());
				user.setPassword(encoder.encode(body.getPassword()));
				user.setPhone(body.getPhone());
				user.setAuth(body.getAuth());
				return user;
			})
			.map(userRepository::save)
			.map(user -> Header.OK(buildUser(userRepository.save(user))))
			.orElseGet(()->Header.ERROR("No DATA"));
	}

	public List<UserResponse> manageUser(String auth) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			List<UserResponse> responseList = new ArrayList<>();
			for(UserInfo userInfo : userRepository.findAll()){
				responseList.add(UserResponse.builder()
								.code(userInfo.getCode())
								.email(userInfo.getEmail())
								.name(userInfo.getName())
								.nickName(userInfo.getNickName())
								.phone(userInfo.getPhone())
								.auth(userInfo.getAuth())
								.build());
			}
			return responseList;
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
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

	public Header deleteUser(Integer code) {
		return userRepository.findById(code)
			.map(delUser -> {
				userRepository.delete(delUser);
				return Header.OK();
			}).orElseGet(() -> Header.ERROR("No DATA"));
	}
}
