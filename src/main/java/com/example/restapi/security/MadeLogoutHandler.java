package com.example.restapi.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
public class MadeLogoutHandler implements LogoutHandler {
	private final Logger logger;
	public MadeLogoutHandler(Logger logger) {
		this.logger = logger;
	}

	@Override
	public void logout(HttpServletRequest req, HttpServletResponse res,
		Authentication authentication) {
		HttpSession session = req.getSession();
		session.removeAttribute("user");
		// logger.info(String.valueOf(authentication));
		logger.info("Logout successful.");
	}
}