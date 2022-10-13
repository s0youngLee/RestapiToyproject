package com.example.restapi.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		final UserInfo user = userRepository.findByEmail(email);
		if(user == null) {
			throw new UsernameNotFoundException(email + " doesn't exist.");
		}
		return UserInfo.builder()
				.code(user.getCode())
				.email(user.getEmail())
				.password(user.getPassword())
				.auth(user.getAuth())
				.build();
	}

	public Integer register(Header<UserRequest> infoDto) {
		UserRequest body = infoDto.getData();

		UserInfo user = UserInfo.builder()
			.code(body.getCode())
			.email(body.getEmail())
			.password(encoder.encode(body.getPassword()))
			.auth(body.getAuth())
			.build();

		userRepository.save(user);

		return user.getCode();
	}

	public UserInfo login(String email, String password) {
		return userRepository.findByEmailAndPassword(email, password);
	}

	public Header<UserInfo> loadInfo(String email){
		return Header.OK(userRepository.findByEmail(email));
	}

	// public Header<Optional<UserInfo>> loadInfoInt(int id){
	// 	return Header.OK(userRepository.findById(id));
	// }
}
