package com.example.restapi.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.restapi.service.UserSecurityService;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class MadeLoginSuccessHandler implements AuthenticationSuccessHandler {
	private final UserSecurityService userSecurityService;

	public MadeLoginSuccessHandler(UserSecurityService userSecurityService) {
		this.userSecurityService = userSecurityService;
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
		HttpSession session = request.getSession(false);
		if(session != null){
			session.setAttribute("user", userSecurityService.loadUserByUsername(authentication.getName()));
			log.info("Authenticated with " + authentication.getName());
			session.setMaxInactiveInterval(1200);
		}else{
			log.warn("No User. Login suggested.");
		}

	}
}
