package com.example.restapi.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.restapi.service.UserSecurityService;

public class MadeLoginSuccessHandler implements AuthenticationSuccessHandler {
	private final UserSecurityService userSecurityService;

	private final Logger logger;
	public MadeLoginSuccessHandler(UserSecurityService userSecurityService, Logger logger) {
		this.userSecurityService = userSecurityService;
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

		request.getSession().setAttribute("user", userSecurityService.loadUserByUsername(authentication.getName()));
		logger.info("Authenticated with " + authentication.getName());
		response.sendRedirect("http://localhost:3000/board");
	}
}
