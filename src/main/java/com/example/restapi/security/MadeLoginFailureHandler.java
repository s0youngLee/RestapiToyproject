package com.example.restapi.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class MadeLoginFailureHandler implements AuthenticationFailureHandler {
	private final Logger logger;
	public MadeLoginFailureHandler(Logger logger) {
		this.logger = logger;
	}

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException exception) throws IOException, ServletException {

		logger.error("Exception - " + exception.getMessage());
		logger.error("Exception - " + exception.getCause());
		response.sendRedirect("http://localhost:3000/login");
	}
}
