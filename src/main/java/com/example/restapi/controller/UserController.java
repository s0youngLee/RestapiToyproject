package com.example.restapi.controller;

import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.service.UserService;

@RestController
@SessionAttributes("user")
@RequestMapping("/user")
public class UserController {
	private final UserService userService;
	public UserController(@Lazy UserService userService) {
		this.userService = userService;
	}

	@ModelAttribute("user")
	public UserInfo userForm(){
		return new UserInfo();
	}

	@GetMapping("")
	public Status<UserResponseDto> loadUserInfo(@ModelAttribute("user") UserInfo user){
		return userService.userPage(user);
	}

	@GetMapping("/manage")
	public Status<List<UserResponseDto>> manageUser(@ModelAttribute("user") UserInfo user){
		return Status.OK(userService.userList(user.getAuth()));
	}

	@PostMapping("")
	public Status<UserInfo> signup(@RequestBody Status<UserRequest> request) {
		return userService.register(request);
	}

	@PutMapping("")
	public Status<UserInfo> changePassword(@SessionAttribute("user") UserInfo user, @RequestBody Status<UserRequest> request) {
		return userService.changePassword(user.getCode(), request);
	}
	@PutMapping("/{code}")
	public Status<UserInfo> changeAuth(@ModelAttribute("user") UserInfo user,@PathVariable Integer code, @RequestBody Status<UserRequest> request){
		return userService.changeAuth(user.getAuth(), request, code);
	}

	@DeleteMapping("/{code}")
	public Status deleteUser(@PathVariable Integer code){
		return userService.deleteUser(code);
	}
}