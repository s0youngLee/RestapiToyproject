package com.example.restapi.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.restapi.service.UserService;

public class MadeLoginSuccessHandler implements AuthenticationSuccessHandler {
	private final UserService userService;

	private final Logger logger;
	public MadeLoginSuccessHandler(UserService userService, Logger logger) {
		this.userService = userService;
		this.logger = logger;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
		Authentication authentication) throws IOException, ServletException {
		AuthenticationSuccessHandler.super.onAuthenticationSuccess(request, response, chain, authentication);
	}

	@Override
	@Transactional
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {
		HttpSession session = request.getSession();
		session.setAttribute("user", userService.loadUserByUsername(authentication.getName()));
		response.addCookie(new Cookie("isLogin", String.valueOf(authentication.isAuthenticated())));
		logger.info("Authenticated with " + authentication.getName());
		response.sendRedirect("http://localhost:3000/board");
	}
}
