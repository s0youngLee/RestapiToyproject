package com.example.restapi.security;

import java.io.IOException;
import java.time.DateTimeException;
import java.time.LocalDateTime;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class MadeLoginSuccessHandler implements AuthenticationSuccessHandler {
	private final UserDetailsService userSecurityService;
	private final UserRepository userRepository;
	public MadeLoginSuccessHandler(UserDetailsService userSecurityService, UserRepository userRepository) {
		this.userSecurityService = userSecurityService;
		this.userRepository = userRepository;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
		Authentication authentication) throws IOException, ServletException {
		AuthenticationSuccessHandler.super.onAuthenticationSuccess(request, response, chain, authentication);
	}

	@Override
	@Transactional
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {
		HttpSession session = request.getSession(false);
		if(session != null){
			UserDetails authenticated = userSecurityService.loadUserByUsername(authentication.getName());
			UserInfo user = userRepository.findByEmail(authentication.getName());
			try{
				if((LocalDateTime.now().minusDays(7)).isAfter(user.getLastAccess())){
					log.warn("Login 7 +days ago.");
					response.setHeader("lastLogin", "true");
				}
			}catch (DateTimeException e){
				e.printStackTrace();
			}
			session.setAttribute("user", authenticated);
			session.setMaxInactiveInterval(1200);
			log.info("Authenticated with " + authentication.getName());

			if(authentication.isAuthenticated()){
				response.sendRedirect("http://192.168.1.158:3000/user");
			}
		}else{
			log.warn("No User. Login suggested.");
		}
	}
}
