package com.example.restapi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.Status;
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
	private final ArticleService articleService;
	private final ExcelSetting<UserExcelResponseDto> excelSetting;
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	public UserService(@Lazy UserRepository userRepository, ArticleRepository articleRepository,
		ArticleService articleService, ExcelSetting<UserExcelResponseDto> excelSetting) {
		this.userRepository = userRepository;
		this.articleRepository = articleRepository;
		this.articleService = articleService;
		this.excelSetting = excelSetting;
	}

	public Status<UserResponseDto> userPage(UserInfo user, HttpServletRequest request) {
		HttpSession session = request.getSession();
		if(session == null || !request.isRequestedSessionIdValid() || user == null){
			log.warn("Session condition : Invalid");
			return null;
		}else{
			return Status.OK(buildUser(user));
		}
	}

	public List<UserResponseDto> userList(String auth) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			List<UserResponseDto> responseList = new ArrayList<>();
			for(UserInfo userInfo : userRepository.findAll()){
				responseList.add(buildUser(userInfo));
			}
			return responseList;
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}

	public Status<UserInfo> register(Status<UserRequest> infoDto, HttpServletResponse response) {
		UserRequest body = infoDto.getData();
		UserInfo user = UserInfo.builder()
				.email(body.getEmail())
				.password(encoder.encode(body.getPassword()))
				.auth(body.getAuth())
				.nickName(body.getNickName())
				.name(body.getName())
				.phone(body.getPhone())
				.lastAccess(LocalDateTime.now())
				.build();
		try{
			return Status.OK(userRepository.save(user));
		}catch (DataIntegrityViolationException e){
			log.error("Existing User. Please Try again.");
			response.setStatus(451);
			return Status.ERROR("Existing User. Please Try again.");
		}
	}

	public Status<UserInfo> userInfoEdit(UserInfo user, Status<UserRequest> request) {
		UserRequest body = request.getData();

		user.setNickName(body.getNickName());
		log.info(body.getNickName());
		if(!Objects.equals(body.getPassword(), "")){
			user.setPassword(encoder.encode(body.getPassword()));
			log.info(body.getPassword());
		}
		user.setPhone(body.getPhone());
		log.info(body.getPhone());
		return Status.OK(userRepository.save(user));
	}



	public Status<UserInfo> changeAuth(String auth, Status<UserRequest> request, Integer code) {
		if(Objects.equals(auth, "ROLE_ADMIN")){
			UserRequest body = request.getData();
			UserInfo user = userRepository.getReferenceById(code);

			user.setAuth(body.getAuth());
			return Status.OK(userRepository.save(user));
		}else {
			throw new PermissionDeniedDataAccessException("Permission Denied.", new Throwable(auth));
		}
	}

	public Status<UserInfo> updateAccessDate(UserInfo user) {
		user.setLastAccess(LocalDateTime.now());
		return Status.OK(userRepository.save(user));
	}


	public Status deleteUser(int code) {
		// 임시 처리
		List<Article> toDelete = articleRepository.findAllByUser(userRepository.getReferenceById(code));
		for(Article article : toDelete){
			articleService.delete(article.getId());
		}

		return userRepository.findById(code)
			.map(delUser -> {
				userRepository.delete(delUser);
				return Status.OK();
			}).orElseGet(() -> Status.ERROR("No DATA"));
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
