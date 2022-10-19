package com.example.restapi.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Header;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.ArticleListResponseDto;
import com.example.restapi.model.network.response.CommentResponseDto;
import com.example.restapi.model.network.response.UserResponse;
import com.example.restapi.service.ArticleApiLogicService;
import com.example.restapi.service.CommentApiLogicService;
import com.example.restapi.service.UserService;

@RestController
@SessionAttributes("user")
public class UserController {
	private final UserService userService;
	private final ArticleApiLogicService articleApiLogicService;
	private final CommentApiLogicService commentApiLogicService;

	@ModelAttribute("user")
	public UserInfo userForm(){
		return new UserInfo();
	}

	public UserController(@Lazy UserService userService, @Lazy ArticleApiLogicService articleApiLogicService,
		@Lazy CommentApiLogicService commentApiLogicService) {
		this.userService = userService;
		this.articleApiLogicService = articleApiLogicService;
		this.commentApiLogicService = commentApiLogicService;
	}

	@PostMapping("/userlogin")
	public String login() {
		return "redirect:/login";
	}

	@PostMapping("/user")
	public String signup(@RequestBody Header<UserRequest> request) {
		userService.register(request);
		return "redirect:/login";
	}

	@GetMapping("/user")
	public Header<UserInfo> loadUserInfo(@ModelAttribute("user") UserInfo user){
		return Header.OK(user);
	}

	@PutMapping("/user")
	public Header<UserInfo> changePassword(@SessionAttribute("user") UserInfo user, @RequestBody Header<UserRequest> request) {
		return userService.changePassword(user.getCode(), request);
	}

	@GetMapping("/user/manage")
	public Header<List<UserResponse>> manageUser(@ModelAttribute("user") UserInfo user){
		return Header.OK(userService.manageUser(user.getAuth()));
	}

	@PutMapping("/user/manage/{code}")
	public Header<UserInfo> changeAuth(@ModelAttribute("user") UserInfo user,@PathVariable Integer code, @RequestBody Header<UserRequest> request){
		return userService.changeAuth(user.getAuth(), request, code);
	}

	@DeleteMapping("/user/manage/{code}")
	public Header deleteUser(@PathVariable Integer code){
		return userService.deleteUser(code);
	}

	@GetMapping("/user/article")
	public List<ArticleListResponseDto> getMyArticles(@SessionAttribute("user") UserInfo user){
		return articleApiLogicService.getUserArticles(user.getNickName());
	}

	@GetMapping("/user/comment")
	public List<CommentResponseDto> getMyComments(@SessionAttribute("user") UserInfo user){
		return commentApiLogicService.getUserComment(user.getNickName());
	}


	@GetMapping(value = "/logout")
	public String logoutPage(HttpServletRequest request, HttpServletResponse response, @ModelAttribute("user") UserInfo user) {
		return "redirect:/logout";
	}
}