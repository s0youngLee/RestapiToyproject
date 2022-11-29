package com.example.restapi.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.service.UserService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/user")
public class UserController {
	private final UserService userService;
	public UserController(@Lazy UserService userService) {
		this.userService = userService;
	}

	@GetMapping("")
	public ResponseEntity<String> userinfo(@SessionAttribute("user") UserResponseDto user, HttpServletRequest request, HttpServletResponse response){
		return userService.userinfo(user, request, response);
	}

	@GetMapping("/info")
	public ResponseEntity<UserResponseDto> userPage(@SessionAttribute("user") UserResponseDto user, HttpServletRequest request){
		return userService.userPage(user, request);
	}

	@GetMapping("/manage")
	public ResponseEntity<List<UserResponseDto>> manageUser(@SessionAttribute("user") UserResponseDto user){
		return userService.userList(user.auth());
	}

	@PostMapping("")
	public ResponseEntity<UserInfo> signup(@RequestBody UserRequest request) {
		return userService.register(request);
	}

	@PutMapping("")
	public ResponseEntity<UserResponseDto> userInfoEdit(@SessionAttribute("user") UserResponseDto user, @RequestBody UserRequest request) {
		return userService.userInfoEdit(user, request);
	}
	@PutMapping("/manage/{code}")
	public ResponseEntity<UserResponseDto> changeAuth(@SessionAttribute("user") UserResponseDto user, @PathVariable int code, @RequestBody UserRequest request){
		return userService.changeAuth(user, request, code);
	}

	@DeleteMapping("/{code}")
	public ResponseEntity<UserInfo> deleteUser(@PathVariable Integer code){
		if(code!=0){
			return userService.deleteUser(code);
		}else{
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@GetMapping("/excel/download")
	public void downloadExcelUser(HttpServletResponse response){
		try{
			userService.downloadExcelUser(response);
		}catch (Exception e){
			log.error(e.getMessage());
		}
	}

}