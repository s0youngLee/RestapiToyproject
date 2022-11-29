package com.example.restapi.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class LoginService {

	public Boolean status(HttpServletRequest request){
		HttpSession session = request.getSession(false);
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if((session.getAttribute("user") == null) && !auth.getAuthorities().equals("ROLE_ANONYMOUS")){
			session.setAttribute("user", auth.getPrincipal());
		}
		return session.getAttribute("user") != null;
	}

}
