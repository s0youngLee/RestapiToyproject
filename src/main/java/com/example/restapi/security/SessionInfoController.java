package com.example.restapi.security;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class SessionInfoController {
	@GetMapping("/session-info")
	public String sessionInfo(HttpServletRequest request){
		HttpSession session = request.getSession(false);
		if (session == null){
			return "Any session.";
		}

		log.info("sessionId={}", session.getId());
		log.info("session time={}", session.getMaxInactiveInterval());
		log.info("creationTime={}", new Date(session.getCreationTime()));
		log.info("lastAccessTjme={}",new Date(session.getLastAccessedTime()));
		log.info("session new? ={}", session.isNew());
		return "" + session.getLastAccessedTime();
	}

	@GetMapping("/invalid")
	public Integer sessionExpired(){
		// status code 403..?
		return 403;
	}
}