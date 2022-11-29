package com.example.restapi.security;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.core.log.LogMessage;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.AccountStatusUserDetailsChecker;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.rememberme.CookieTheftException;
import org.springframework.security.web.authentication.rememberme.InvalidCookieException;
import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationException;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class CustomRememberMeServices implements RememberMeServices, InitializingBean, LogoutHandler, MessageSourceAware {
	private final SecureRandom random = new SecureRandom();
	public static final int DEFAULT_SERIES_LENGTH = 16;

	public static final int DEFAULT_TOKEN_LENGTH = 16;

	public static final String SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY = "remember-me";

	public static final String DEFAULT_PARAMETER = "remember-me";

	public static final int TWO_WEEKS_S = 1209600;

	private static final String DELIMITER = ":";

	protected final Log logger = LogFactory.getLog(getClass());

	protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

	private final UserDetailsService userDetailsService;

	private UserDetailsChecker userDetailsChecker = new AccountStatusUserDetailsChecker();

	private AuthenticationDetailsSource<HttpServletRequest, ?> authenticationDetailsSource = new WebAuthenticationDetailsSource();

	private String cookieName = SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY;

	private String cookieDomain;

	private String parameter = DEFAULT_PARAMETER;

	private boolean alwaysRemember;

	private final String key;

	private int tokenValiditySeconds = TWO_WEEKS_S;

	private Boolean useSecureCookie = null;

	private GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();
	private final JpaPersistentTokenRepository customTokenRepository;

	protected CustomRememberMeServices(String key, UserDetailsService userDetailsService, JpaPersistentTokenRepository customTokenRepository) {
		this.customTokenRepository = customTokenRepository;
		Assert.hasLength(key, "key cannot be empty or null");
		Assert.notNull(userDetailsService, "UserDetailsService cannot be null");
		this.key = key;
		this.userDetailsService = userDetailsService;
	}


	protected UserDetails processAutoLoginCookie(String[] cookieTokens, HttpServletRequest request,
		HttpServletResponse response) {
		// if(true){
		if(isContainPaySecurityKey(request)){
			String deviceSn = getDeviceSn(request);
			// String deviceSn = "eaf9bc89308a13f7cf2b47e8a8912e9930dde7d8";
			CustomRememberMeToken token = this.customTokenRepository.getTokenForDeviceSn(deviceSn);
			if(token == null){
				throw new RememberMeAuthenticationException("No persistent token found for device sn : " + deviceSn);
			}
			if(!Objects.requireNonNull(deviceSn).equals(token.deviceSn())){
				this.customTokenRepository.removeMobileUserTokens(token.username());
				throw new CookieTheftException(this.messages.getMessage(
					"PersistentTokenBasedRememberMeServices.DeviceSnStolen",
					"Invalid remember-me token device_sn mismatch. Implies previous cookie theft attack"));
			}
			if(token.date().getTime() + getTokenValiditySeconds() * 1000L < System.currentTimeMillis()){
				throw new RememberMeAuthenticationException("Remember-me login has expired");
			}
			this.logger.debug(LogMessage.format("Refreshing persistent login token for user '%s', series '%s'",
				token.username(), token.deviceSn()));
			CustomRememberMeToken newToken = new CustomRememberMeToken(token.username(), token.deviceSn(), generateTokenData(),
				new Date());
			try{
				this.customTokenRepository.updateMobileToken(newToken.deviceSn(), newToken.tokenValue(), newToken.date());
				this.addMobileCookie(newToken, request, response);
			}
			catch (Exception ex) {
				this.logger.error("Failed to update token: ", ex);
				throw new RememberMeAuthenticationException("Autologin failed due to data access problem");
			}
			return getUserDetailsService().loadUserByUsername(token.username());
		}else{
			if (cookieTokens.length != 2) {
				throw new InvalidCookieException("Cookie token did not contain " + 2 + " tokens, but contained '"
					+ Arrays.asList(cookieTokens) + "'");
			}
			String presentedSeries = cookieTokens[0];
			String presentedToken = cookieTokens[1];
			PersistentRememberMeToken token = this.customTokenRepository.getTokenForSeries(presentedSeries);
			if (token == null) {
				// No series match, so we can't authenticate using this cookie
				throw new RememberMeAuthenticationException("No persistent token found for series id: " + presentedSeries);
			}
			// We have a match for this user/series combination
			if (!presentedToken.equals(token.getTokenValue())) {
				// Token doesn't match series value. Delete all logins for this user and throw
				// an exception to warn them.
				this.customTokenRepository.removeUserTokens(token.getUsername());
				throw new CookieTheftException(this.messages.getMessage(
					"PersistentTokenBasedRememberMeServices.cookieStolen",
					"Invalid remember-me token (Series/token) mismatch. Implies previous cookie theft attack."));
			}
			if (token.getDate().getTime() + getTokenValiditySeconds() * 1000L < System.currentTimeMillis()) {
				throw new RememberMeAuthenticationException("Remember-me login has expired");
			}
			// Token also matches, so login is valid. Update the token value, keeping the
			// *same* series number.
			this.logger.debug(LogMessage.format("Refreshing persistent login token for user '%s', series '%s'",
				token.getUsername(), token.getSeries()));
			PersistentRememberMeToken newToken = new PersistentRememberMeToken(token.getUsername(), token.getSeries(),
				generateTokenData(), new Date());
			try {
				customTokenRepository.updateToken(newToken.getSeries(), newToken.getTokenValue(), newToken.getDate());
				this.addPCCookie(newToken, request, response);
			}
			catch (Exception ex) {
				this.logger.error("Failed to update token: ", ex);
				throw new RememberMeAuthenticationException("Autologin failed due to data access problem");
			}
			return getUserDetailsService().loadUserByUsername(token.getUsername());
		}
	}

	protected void onLoginSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication successfulAuthentication) {
		String username = successfulAuthentication.getName();
		this.logger.debug(LogMessage.format("Creating new persistent login for user %s", username));
		if(isContainPaySecurityKey(request)){
			CustomRememberMeToken persistentToken = new CustomRememberMeToken(username, getDeviceSn(request),
				generateTokenData(), new Date());
			try {
				customTokenRepository.createNewToken(persistentToken);
				this.addMobileCookie(persistentToken, request, response);
				logger.info("User-Agent device_sn : " + getDeviceSn(request));
			}
			catch (Exception ex) {
				this.logger.error("Failed to save persistent token ", ex);
			}
		}else{
			PersistentRememberMeToken persistentToken = new PersistentRememberMeToken(username, generateSeriesData(),
				generateTokenData(), new Date());
			try {
				customTokenRepository.createNewToken(persistentToken);
				this.addPCCookie(persistentToken, request, response);
			}
			catch (Exception ex) {
				this.logger.error("Failed to save persistent token ", ex);
			}
		}
	}

	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		this.logger.debug(LogMessage
			.of(() -> "Logout of user " + ((authentication != null) ? authentication.getName() : "Unknown")));
		cancelCookie(request, response);
		if (authentication != null) {
			// if(true){
			if(isContainPaySecurityKey(request)){
				this.customTokenRepository.removeMobileUserTokens(authentication.getName());
			}else{
				this.customTokenRepository.removeUserTokens(authentication.getName());
			}
		}
	}

	private void addPCCookie(PersistentRememberMeToken token, HttpServletRequest request, HttpServletResponse response) {
		setCookie(new String[] { token.getSeries(), token.getTokenValue() }, getTokenValiditySeconds(), request, response);
	}
	private void addMobileCookie(CustomRememberMeToken token, HttpServletRequest request, HttpServletResponse response) {
		setCookie(new String[] { token.deviceSn(), token.tokenValue() }, getTokenValiditySeconds(), request, response);
	}

	protected String generateSeriesData() {
		byte[] newSeries = new byte[DEFAULT_SERIES_LENGTH];
		this.random.nextBytes(newSeries);
		return new String(Base64.getEncoder().encode(newSeries));
	}

	protected String generateTokenData() {
		byte[] newToken = new byte[DEFAULT_TOKEN_LENGTH];
		this.random.nextBytes(newToken);
		return new String(Base64.getEncoder().encode(newToken));
	}

	private boolean isContainPaySecurityKey(HttpServletRequest request) {
		return request.getHeader("User-Agent").contains("device_sn=");
	}

	private String getDeviceSn(HttpServletRequest request) {
		if (isContainPaySecurityKey(request)) {
			String userAgent = request.getHeader("User-Agent");
			int keyIndex = userAgent.indexOf("device_sn=", 90);
			return userAgent.substring(keyIndex + 10, keyIndex + 50);
		} else {
			return null;
		}
	}

	@Override
	public void afterPropertiesSet() {
		Assert.hasLength(this.key, "key cannot be empty or null");
		Assert.notNull(this.userDetailsService, "A UserDetailsService is required");
	}

	@Override
	public final Authentication autoLogin(HttpServletRequest request, HttpServletResponse response) {
		String rememberMeCookie = extractRememberMeCookie(request);
		String mobileUser = getDeviceSn(request);
		if (rememberMeCookie == null && mobileUser == null) {
			// log.warn("Remember-me not detected");
			return null;
		}
		if(mobileUser != null && rememberMeCookie != null){
			this.logger.debug("Remember-me mobile detected");
			return tryAuthenticate(new String[]{"MobileTokens"}, request, response);
		}else if (rememberMeCookie != null){
			this.logger.debug("Remember-me cookie detected");
			if (rememberMeCookie.length() == 0) {
				this.logger.debug("Cookie was empty");
				cancelCookie(request, response);
				return null;
			}
			String[] cookieTokens = decodeCookie(rememberMeCookie);
			return tryAuthenticate(cookieTokens, request, response);
		}
		cancelCookie(request, response);
		return null;
	}

	private Authentication tryAuthenticate(String[] cookieTokens, HttpServletRequest request, HttpServletResponse response){
		try {
			UserDetails user = processAutoLoginCookie(cookieTokens, request, response);
			this.userDetailsChecker.check(user);
			this.logger.debug("Remember-me cookie accepted");
			return createSuccessfulAuthentication(request, user);
		}
		catch (CookieTheftException ex) {
			cancelCookie(request, response);
			throw ex;
		}
		catch (UsernameNotFoundException ex) {
			this.logger.debug("Remember-me login was valid but corresponding user not found.", ex);
		}
		catch (InvalidCookieException ex) {
			this.logger.debug("Invalid remember-me cookie: " + ex.getMessage());
		}
		catch (AccountStatusException ex) {
			this.logger.debug("Invalid UserDetails: " + ex.getMessage());
		}
		catch (RememberMeAuthenticationException ex) {
			this.logger.debug(ex.getMessage());
		}
		cancelCookie(request, response);
		return null;
	}

	protected String extractRememberMeCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if ((cookies == null) || (cookies.length == 0)) {
			return null;
		}
		for (Cookie cookie : cookies) {
			if (this.cookieName.equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}

	protected Authentication createSuccessfulAuthentication(HttpServletRequest request, UserDetails user) {
		RememberMeAuthenticationToken auth = new RememberMeAuthenticationToken(this.key, user,
			this.authoritiesMapper.mapAuthorities(user.getAuthorities()));
		auth.setDetails(this.authenticationDetailsSource.buildDetails(request));
		return auth;
	}

	protected String[] decodeCookie(String cookieValue) throws InvalidCookieException {
		for (int j = 0; j < cookieValue.length() % 4; j++) {
			cookieValue = cookieValue + "=";
		}
		String cookieAsPlainText;
		try {
			cookieAsPlainText = new String(Base64.getDecoder().decode(cookieValue.getBytes()));
		}
		catch (IllegalArgumentException ex) {
			throw new InvalidCookieException("Cookie token was not Base64 encoded; value was '" + cookieValue + "'");
		}
		String[] tokens = StringUtils.delimitedListToStringArray(cookieAsPlainText, DELIMITER);
		for (int i = 0; i < tokens.length; i++) {
			tokens[i] = URLDecoder.decode(tokens[i], StandardCharsets.UTF_8);
		}
		return tokens;
	}

	protected String encodeCookie(String[] cookieTokens) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < cookieTokens.length; i++) {
			sb.append(URLEncoder.encode(cookieTokens[i], StandardCharsets.UTF_8));
			if (i < cookieTokens.length - 1) {
				sb.append(DELIMITER);
			}
		}
		String value = sb.toString();
		sb = new StringBuilder(new String(Base64.getEncoder().encode(value.getBytes())));
		while (sb.charAt(sb.length() - 1) == '=') {
			sb.deleteCharAt(sb.length() - 1);
		}
		return sb.toString();
	}

	@Override
	public final void loginFail(HttpServletRequest request, HttpServletResponse response) {
		this.logger.debug("Interactive login attempt was unsuccessful.");
		cancelCookie(request, response);
		onLoginFail(request, response);
	}

	protected void onLoginFail(HttpServletRequest request, HttpServletResponse response) {
		log.warn("Login Failed with {}, response = {}", request.getRequestedSessionId(), response.getStatus());
	}

	@Override
	public final void loginSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication successfulAuthentication) {
		if (!rememberMeRequested(request, this.parameter)) {
			this.logger.debug("Remember-me login not requested.");
			return;
		}
		onLoginSuccess(request, response, successfulAuthentication);
	}

	protected boolean rememberMeRequested(HttpServletRequest request, String parameter) {
		if (this.alwaysRemember) {
			return true;
		}
		String paramValue = request.getParameter(parameter);
		if (paramValue != null) {
			if (paramValue.equalsIgnoreCase("true") || paramValue.equalsIgnoreCase("on")
				|| paramValue.equalsIgnoreCase("yes") || paramValue.equals("1")) {
				return true;
			}
		}
		this.logger.debug(
			LogMessage.format("Did not send remember-me cookie (principal did not set parameter '%s')", parameter));
		return false;
	}

	protected void cancelCookie(HttpServletRequest request, HttpServletResponse response) {
		this.logger.debug("Cancelling cookie");
		Cookie cookie = new Cookie(this.cookieName, null);
		cookie.setMaxAge(0);
		cookie.setPath(getCookiePath(request));
		if (this.cookieDomain != null) {
			cookie.setDomain(this.cookieDomain);
		}
		cookie.setSecure((this.useSecureCookie != null) ? this.useSecureCookie : request.isSecure());
		response.addCookie(cookie);
	}

	protected void setCookie(String[] tokens, int maxAge, HttpServletRequest request, HttpServletResponse response) {
		String cookieValue = encodeCookie(tokens);
		Cookie cookie = new Cookie(this.cookieName, cookieValue);
		cookie.setMaxAge(maxAge);
		cookie.setPath(getCookiePath(request));
		if (this.cookieDomain != null) {
			cookie.setDomain(this.cookieDomain);
		}
		if (maxAge < 1) {
			cookie.setVersion(1);
		}
		cookie.setSecure((this.useSecureCookie != null) ? this.useSecureCookie : request.isSecure());
		cookie.setHttpOnly(true);
		response.addCookie(cookie);
	}

	private String getCookiePath(HttpServletRequest request) {
		String contextPath = request.getContextPath();
		return (contextPath.length() > 0) ? contextPath : "/";
	}

	public void setCookieName(String cookieName) {
		Assert.hasLength(cookieName, "Cookie name cannot be empty or null");
		this.cookieName = cookieName;
	}

	public void setCookieDomain(String cookieDomain) {
		Assert.hasLength(cookieDomain, "Cookie domain cannot be empty or null");
		this.cookieDomain = cookieDomain;
	}

	protected String getCookieName() {
		return this.cookieName;
	}

	public void setAlwaysRemember(boolean alwaysRemember) {
		this.alwaysRemember = alwaysRemember;
	}

	public void setParameter(String parameter) {
		Assert.hasText(parameter, "Parameter name cannot be empty or null");
		this.parameter = parameter;
	}

	public String getParameter() {
		return this.parameter;
	}

	protected UserDetailsService getUserDetailsService() {
		return this.userDetailsService;
	}

	public String getKey() {
		return this.key;
	}

	public void setTokenValiditySeconds(int tokenValiditySeconds) {
		this.tokenValiditySeconds = tokenValiditySeconds;
	}

	protected int getTokenValiditySeconds() {
		return this.tokenValiditySeconds;
	}

	public void setUseSecureCookie(boolean useSecureCookie) {
		this.useSecureCookie = useSecureCookie;
	}

	protected AuthenticationDetailsSource<HttpServletRequest, ?> getAuthenticationDetailsSource() {
		return this.authenticationDetailsSource;
	}

	public void setAuthenticationDetailsSource(
		AuthenticationDetailsSource<HttpServletRequest, ?> authenticationDetailsSource) {
		Assert.notNull(authenticationDetailsSource, "AuthenticationDetailsSource cannot be null");
		this.authenticationDetailsSource = authenticationDetailsSource;
	}

	public void setUserDetailsChecker(UserDetailsChecker userDetailsChecker) {
		this.userDetailsChecker = userDetailsChecker;
	}

	public void setAuthoritiesMapper(GrantedAuthoritiesMapper authoritiesMapper) {
		this.authoritiesMapper = authoritiesMapper;
	}

	@Override
	public void setMessageSource(MessageSource messageSource) {
		Assert.notNull(messageSource, "messageSource cannot be null");
		this.messages = new MessageSourceAccessor(messageSource);
	}

}

