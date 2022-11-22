package com.example.restapi.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class MadeLoginFailureHandler implements AuthenticationFailureHandler {
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException exception) {

		// unauthorized 시 usenamenotfound -> badcredential -> 403
		// password incorrenct -> badcredentail -> 403..
		// setHideUserNotFoundException(false); 하는 방법, 보안 약화됨 - 임시 처리
		String exceptionName = exception.getClass().getSimpleName();

		if(exceptionName.equals("UsernameNotFoundException")){
			response.setStatus(HttpStatus.NOT_FOUND.value());
		}else if(exception.getClass().getSimpleName().equals("BadCredentialsException")){
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
		}
		log.error("Exception - " + exceptionName);
	}
}
