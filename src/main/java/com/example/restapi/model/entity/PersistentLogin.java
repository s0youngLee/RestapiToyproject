package com.example.restapi.model.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;

@Entity
public class PersistentLogin implements Serializable {
	@Id
	private String series;
	private String username;
	private String token;
	private Date lastUsed;

	protected PersistentLogin() {
	}

	private PersistentLogin(final PersistentRememberMeToken token) {
		this.series = token.getSeries();
		this.username = token.getUsername();
		this.token = token.getTokenValue();
		this.lastUsed = token.getDate();
	}

	public static PersistentLogin from(final PersistentRememberMeToken token) {
		return new PersistentLogin(token);
	}

	public String getSeries() {
		return series;
	}

	public String getUsername() {
		return username;
	}

	public String getToken() {
		return token;
	}

	public Date getExpiredDate() {
		return lastUsed;
	}

	public void updateToken(final String tokenValue, final Date lastUsed){
		this.token = tokenValue;
		this.lastUsed = lastUsed;
	}
}
