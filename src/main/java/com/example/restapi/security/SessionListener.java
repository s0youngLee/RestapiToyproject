package com.example.restapi.security;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.extern.log4j.Log4j2;

@Log4j2
@WebListener
public class SessionListener implements HttpSessionListener {

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		if(session.getAttribute("user") == null){
			try{
				Authentication auth = SecurityContextHolder.getContext().getAuthentication();
				if(auth.isAuthenticated()){
					session.setAttribute("user", auth.getPrincipal());
					session.setMaxInactiveInterval(1200);
				}
			}catch (NullPointerException e){
				log.warn("null-point exception");
			}
		}

		log.info("created at {}", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss")));
		log.info("JSESSIONID = {}", session.getId());
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		// 세션 만료시 호출
		HttpSession session = event.getSession();
		long lastTime = session.getLastAccessedTime();
		long nowTime = System.currentTimeMillis();
		long expiredTime = nowTime - lastTime;
		String id = session.getId();

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		log.info("JSESSIONID = {}", id);
		log.info("Authenticated with = {}", auth != null ? auth.getName() : "Not Found");
		log.warn("session expired in {} m {} s.", expiredTime / (1000 * 60), (expiredTime % (1000 * 60))/1000);
	}


}