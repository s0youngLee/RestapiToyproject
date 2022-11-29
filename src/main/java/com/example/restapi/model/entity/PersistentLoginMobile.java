package com.example.restapi.model.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.example.restapi.security.CustomRememberMeToken;

@Entity
public class PersistentLoginMobile implements Serializable {
	@Id
	private String deviceSn;
	private String username;
	private String token;
	private Date lastUsed;

	protected PersistentLoginMobile() {
	}

	private PersistentLoginMobile(final CustomRememberMeToken token) {
		this.deviceSn = token.deviceSn();
		this.username = token.username();
		this.token = token.tokenValue();
		this.lastUsed = token.date();
	}

	public static PersistentLoginMobile from(final CustomRememberMeToken token) {
		return new PersistentLoginMobile(token);
	}

	public String getDeviceSn() {
		return deviceSn;
	}

	public String getUsername() {
		return username;
	}

	public String getToken() {
		return token;
	}

	public Date getLastUsed() {
		return lastUsed;
	}

	public void updateToken(final String tokenValue, final Date lastUsed){
		this.token = tokenValue;
		this.lastUsed = lastUsed;
	}

}
