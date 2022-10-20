package com.example.restapi.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.example.restapi.model.entity.UserInfo;

@SessionAttributes("user")
@RestController
public class LoignController {
	@ModelAttribute("user")
	public UserInfo userForm(){
		return new UserInfo();
	}

	@PostMapping("/userlogin")
	public String login() {
		return "redirect:/login";
	}

	@GetMapping(value = "/logout")
	public String logoutPage(
		HttpServletRequest request, HttpServletResponse response, @ModelAttribute("user") UserInfo user) {
		return "redirect:/logout";
	}
}
