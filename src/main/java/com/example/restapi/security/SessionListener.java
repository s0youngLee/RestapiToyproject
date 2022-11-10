package com.example.restapi.security;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import lombok.extern.log4j.Log4j2;

@Log4j2
@WebListener
public class SessionListener implements HttpSessionListener {
	@Override
	public void sessionCreated(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		long time = session.getCreationTime();
		String id = session.getId();
		log.info("created at : " + time + id);
	}


	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		// 세션 만료시 호출
		HttpSession session = event.getSession();
		long time = session.getCreationTime();
		long last_time = session.getLastAccessedTime();
		long now_time = System.currentTimeMillis();
		String id = session.getId();
		log.warn("session expired in " + (now_time - last_time) + "ms." + id);
	}

}