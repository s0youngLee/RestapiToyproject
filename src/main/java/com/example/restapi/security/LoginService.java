package com.example.restapi.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

@Service
public class LoginService {

	public Boolean status(HttpServletRequest request){
		HttpSession session = request.getSession(false);
		return session != null;
	}

}
