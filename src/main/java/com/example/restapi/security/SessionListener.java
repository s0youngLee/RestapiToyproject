package com.example.restapi.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import lombok.extern.log4j.Log4j2;

@Log4j2
@WebListener
public class SessionListener implements HttpSessionListener {

	private final LoginService loginService;

	public SessionListener(LoginService loginService) {
		this.loginService = loginService;
	}

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		LocalDateTime present = Instant.ofEpochMilli(session.getCreationTime()).atZone(ZoneId.systemDefault()).toLocalDate().atStartOfDay();
		;
		String id = session.getId();
		log.info("created at {}", present);
		log.info("JSESSIONID = {}\n", id);
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		// 세션 만료시 호출

		// 세션 만료시에 바로 react로 반응을 보내줄 방법은..?
		HttpSession session = event.getSession();
		long lastTime = session.getLastAccessedTime();
		long nowTime = System.currentTimeMillis();
		long expiredTime = nowTime - lastTime;
		String id = session.getId();

		log.info("Login info = {}", session.getAttribute("user"));
		log.warn("session expired in {} m {} s.", expiredTime / (1000 * 60), (expiredTime % (1000 * 60))/1000);

		log.warn("JSESSIONID = {}\n", id);
	}

}