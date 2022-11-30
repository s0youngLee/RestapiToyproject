package com.example.restapi.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class MadeLogoutHandler implements LogoutHandler {

	private final UserRepository userRepository;

	public MadeLogoutHandler(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public void logout(HttpServletRequest req, HttpServletResponse res,
		Authentication authentication) {
		UserInfo user = userRepository.findByEmail(authentication.getName());
		user.updateLastAccess();
		userRepository.save(user);
		req.getSession().invalidate();
		Cookie[] cookies = req.getCookies();
		for(Cookie cookie : cookies){
			cookie.setMaxAge(0);
		}
		log.info("User {} Logout successful.\n", authentication.getName() != null ? authentication.getName() : "Not Found");
	}
}