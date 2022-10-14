package com.example.restapi.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.LoginInfo;
import com.example.restapi.service.UserService;

@RestController
// @SessionAttributes("username")
// @CrossOrigin("http://localhost:3000")
public class UserController {
	private final UserService userService;

	public UserController(@Lazy UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/userlogin")
	public String login(@RequestBody Header<LoginInfo> loginInfo) {
		LoginInfo info = loginInfo.getData();
		UserInfo loginUser = userService.login(info.getEmail(), info.getPassword());
		return "redirect:/";
	}

	@PostMapping("/user")
	public String signup(@RequestBody Header<UserRequest> request) {
		userService.register(request);
		return "redirect:/";
	}

	// 마이페이지 - 현재 session에서 username을 front단에서 가져오는중. 백단에서 보내고 response로 받아서 해결할 수 있게 해볼 것
	@GetMapping("/user/{email}")
	public Header<UserInfo> loadUserInfo(@PathVariable String email){
		return userService.loadInfo(email);
	}

	@GetMapping(value = "/logout")
	public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
		new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
		return "redirect:/";
	}
}