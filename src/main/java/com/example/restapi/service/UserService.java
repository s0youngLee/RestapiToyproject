package com.example.restapi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.request.UserRequest;
import com.example.restapi.model.network.response.UserExcelResponseDto;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class UserService {
	private final UserRepository userRepository;
	//임시
	private final ArticleRepository articleRepository;
	private final ExcelSetting<UserExcelResponseDto> excelSetting;
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	public UserService(@Lazy UserRepository userRepository, ArticleRepository articleRepository,
		ExcelSetting<UserExcelResponseDto> excelSetting) {
		this.userRepository = userRepository;
		this.articleRepository = articleRepository;
		this.excelSetting = excelSetting;
	}


	public ResponseEntity<String> userinfo(UserInfo user, HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		if(session == null || !request.isRequestedSessionIdValid() || user == null){
			log.warn("Session condition : Invalid");
			return ResponseEntity.notFound().build();
		}else{
			String userinfoValue = user.getNickName() + "/" + user.getAuth() + "/" + user.getCode() + "/" + user.getLastAccess();
			String encoded = Base64.getEncoder().encodeToString(userinfoValue.getBytes());
			response.addCookie(new Cookie("user", encoded));
			return ResponseEntity.ok(encoded);
		}
	}

	public ResponseEntity<UserResponseDto> userPage(UserInfo user, HttpServletRequest request) {
		HttpSession session = request.getSession();
		if(session == null || !request.isRequestedSessionIdValid() || user == null){
			log.warn("Session condition : Invalid");
			return ResponseEntity.notFound().build();
		}else{

			return ResponseEntity.ok(buildUser(user));
		}
	}

	public ResponseEntity<List<UserResponseDto>> userList(String auth) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			List<UserResponseDto> responseList = new ArrayList<>();
			for(UserInfo userInfo : userRepository.findAll()){
				if(userInfo.getCode() != 0){
					responseList.add(buildUser(userInfo));
				}
			}
			return ResponseEntity.ok(responseList);
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}

	public ResponseEntity<UserInfo> register(UserRequest infoDto) {
		UserInfo user = UserInfo.builder()
				.email(infoDto.getEmail())
				.password(encoder.encode(infoDto.getPassword()))
				.auth(infoDto.getAuth())
				.nickName(infoDto.getNickName())
				.name(infoDto.getName())
				.phone(infoDto.getPhone())
				.lastAccess(LocalDateTime.now())
				.build();
		try{
			return ResponseEntity.ok(userRepository.save(user));
		}catch (DataIntegrityViolationException e){
			log.error("Existing User. Please Try again.");
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
	}

	@Transactional
	public ResponseEntity<UserInfo> userInfoEdit(UserInfo user, UserRequest request) {
		if(!Objects.equals(request.getNickName(), "")){
			user.setNickName(request.getNickName());
		}
		if(!Objects.equals(request.getPassword(), "")){
			user.setPassword(encoder.encode(request.getPassword()));
		}
		if(!Objects.equals(request.getPhone(), "")){
			user.setPhone(request.getPhone());
		}
		try{
			userRepository.save(user);
		}catch (IllegalArgumentException e){
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.noContent().build();
	}



	public ResponseEntity<UserInfo> changeAuth(String auth, UserRequest request, Integer code) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			UserInfo user = userRepository.getReferenceById(code);

			user.setAuth(request.getAuth());
			try{
				userRepository.save(user);
			}catch (IllegalArgumentException e){
				return ResponseEntity.badRequest().build();
			}
			return ResponseEntity.noContent().build();
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}

	public ResponseEntity<UserInfo> updateAccessDate(UserInfo user) {
		user.setLastAccess(LocalDateTime.now());
		try{
			userRepository.save(user);
		}catch (IllegalArgumentException e){
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.noContent().build();
	}


	public ResponseEntity<UserInfo> deleteUser(int code) {
		// 임시 처리
		List<Article> toDelete = articleRepository.findAllByUser(userRepository.getReferenceById(code));
		for(Article article : toDelete){
			article.setUser(userRepository.getReferenceById(0));
		}
		try {
			userRepository.delete(userRepository.getReferenceById(code));
		}catch (IllegalArgumentException | NoSuchElementException e){
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.noContent().build();
	}


	public UserResponseDto buildUser(UserInfo user){
		return UserResponseDto.builder()
			.code(user.getCode())
			.email(user.getEmail())
			.name(user.getName())
			.nickName(user.getNickName())
			.phone(user.getPhone())
			.auth(user.getAuth())
			.lastAccess(user.getLastAccess())
			.build();
	}

	public void downloadExcelUser(HttpServletResponse response) {
		List<UserExcelResponseDto> dtoData = new ArrayList<>();
		for(UserInfo user : userRepository.findAll()){
			UserExcelResponseDto body = UserExcelResponseDto.builder()
				.code(user.getCode())
				.email(user.getEmail())
				.name(user.getName())
				.nickName(user.getNickName())
				.phone(user.getPhone())
				.auth(user.getAuth())
				.lastAccess(user.getLastAccess())
				.build();
			dtoData.add(body);
		}

		List<List<String>> dataList = new ArrayList<>();
		for(UserExcelResponseDto data : dtoData){
			dataList.add(data.getData());
		}

		excelSetting.writeWorkbook(response, UserExcelResponseDto.class.getRecordComponents(), dtoData, dataList);
	}

}
