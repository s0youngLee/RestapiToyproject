package com.example.restapi.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.stereotype.Service;

@Service
public class PersistentTokenRememberMeServices implements RememberMeServices {
	@Override
	public Authentication autoLogin(HttpServletRequest request, HttpServletResponse response) {
		//
		return null;
	}

	@Override
	public void loginFail(HttpServletRequest request, HttpServletResponse response) {

	}

	@Override
	public void loginSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication successfulAuthentication) {

	}
}
