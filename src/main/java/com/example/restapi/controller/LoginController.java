package com.example.restapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;

@SessionAttributes("user")
@RestController
public class LoginController {
	@ModelAttribute("user")
	public UserInfo userForm(){
		return new UserInfo();
	}

	@GetMapping("/logininfo")
	public Status<UserInfo> login(@ModelAttribute("user") UserInfo user) {
		return Status.OK(user);
	}

	// @GetMapping(value = "/logout")
	// public String logoutPage(
	// 	HttpServletRequest request, HttpServletResponse response, @ModelAttribute("user") UserInfo user) {
	// 	return "redirect:/logout";
	// }
}
