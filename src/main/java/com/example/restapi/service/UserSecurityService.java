package com.example.restapi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.repository.UserRepository;
import com.example.restapi.security.MadeLogoutHandler;

@Service
public class UserSecurityService implements UserDetailsService {

	private final UserRepository userRepository;
	Logger logger = LoggerFactory.getLogger(MadeLogoutHandler.class);
	public UserSecurityService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		final UserInfo user = userRepository.findByEmail(email);
		if(user == null){
			UsernameNotFoundException e = new UsernameNotFoundException(email + " doesn't exist.");
			logger.error(e.getMessage());
			throw e;
		}
		// logger.info(String.valueOf(user));
		return user;
	}
}
