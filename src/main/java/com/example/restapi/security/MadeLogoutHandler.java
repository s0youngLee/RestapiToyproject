package com.example.restapi.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class MadeLogoutHandler implements LogoutHandler {

	@Override
	public void logout(HttpServletRequest req, HttpServletResponse res,
		Authentication authentication) {
		req.getSession().invalidate();
		Cookie[] cookies = req.getCookies();
		log.info("Cookie : " + cookies[0].getName());
		cookies[0].setMaxAge(0);
		log.info("Logout successful.");
	}
}