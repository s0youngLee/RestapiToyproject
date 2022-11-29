package com.example.restapi.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public Boolean status(HttpServletRequest request){
		return loginService.status(request);
	}
}
