package com.example.restapi.security;

import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.UserInfo;

@Service
public class LoginService {

	public Boolean status(UserInfo user){
		return user != null;
		// HttpSession session = request.getSession(false);
		// return session != null;
	}

}
