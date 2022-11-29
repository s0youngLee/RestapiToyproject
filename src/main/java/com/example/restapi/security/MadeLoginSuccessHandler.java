package com.example.restapi.security;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.response.UserResponseDto;
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
		HttpSession session = request.getSession();
		UserInfo authenticated = (UserInfo)userSecurityService.loadUserByUsername(authentication.getName());
		UserResponseDto userAttribute = UserResponseDto.builder()
			.code(authenticated.getCode())
			.email(authenticated.getUsername())
			.name(authenticated.getName())
			.nickName(authenticated.getNickName())
			.phone(authenticated.getPhone())
			.auth(authenticated.getAuth())
			.lastAccess(authenticated.getLastAccess())
			.build();

		if(session != null){
			session.setAttribute("user", userAttribute);
			session.setMaxInactiveInterval(1200);

			if(authentication.isAuthenticated()){
				UserInfo user = userRepository.findByEmail(authenticated.getUsername());
				Authentication auth = SecurityContextHolder.getContext().getAuthentication();
				boolean suggestLogin = (LocalDateTime.now().minusDays(7)).isAfter(user.getLastAccess());
				String userinfoValue = user.getNickName() + "/" + user.getAuth()  + "/" + suggestLogin + "/" + auth.getAuthorities();
				String encoded = Base64.getEncoder().encodeToString(userinfoValue.getBytes());
				response.addCookie(new Cookie("user", encoded));
			log.info("Authenticated with " + authentication.getName() + "\n");
			}
		}

	}
}
