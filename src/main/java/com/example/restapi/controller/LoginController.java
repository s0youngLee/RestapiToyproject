package com.example.restapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.security.LoginService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
public class LoginController {
	private final LoginService loginService;

	public LoginController(LoginService loginService) {
		this.loginService = loginService;
	}

	@GetMapping("/loginstatus")
	public Boolean status(@SessionAttribute("user") UserInfo user){
		return loginService.status(user);
	}
}
