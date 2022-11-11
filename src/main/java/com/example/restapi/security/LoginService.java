package com.example.restapi.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

	public Boolean status(HttpServletRequest request){
		HttpSession session = request.getSession(false);
			if(session != null){
				return true;
			}else {
				return false;
			}
	}

	public void sessionExpired(HttpServletRequest request){
		SecurityContextHolder.clearContext();
		HttpSession session = request.getSession(false);
		if(session!=null){
			session.invalidate();
		}
		for(Cookie cookie : request.getCookies()){
			cookie.setMaxAge(0);
		}
	}
}
