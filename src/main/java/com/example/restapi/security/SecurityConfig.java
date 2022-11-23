package com.example.restapi.security;

import javax.servlet.http.HttpSessionListener;

import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import com.example.restapi.repository.PersistentLoginRepository;
import com.example.restapi.repository.UserRepository;
import com.example.restapi.service.UserSecurityService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final UserSecurityService userSecurityService;
	private final UserRepository userRepository;
	private final PersistentTokenRepository tokenRepository;
	public SecurityConfig(UserSecurityService userSecurityService, UserRepository userRepository,
		@Lazy PersistentTokenRepository tokenRepository) {
		this.userSecurityService = userSecurityService;
		this.userRepository = userRepository;
		this.tokenRepository = tokenRepository;
	}
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors()
			.and()

			.csrf().disable()
			.httpBasic().disable()

			.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
				.sessionFixation().migrateSession()
				.maximumSessions(30)
				.maxSessionsPreventsLogin(true)
			.and()

			.and()

			.authorizeRequests()
				.antMatchers(HttpMethod.GET, Constants.permitAllArrayGET).permitAll()
				.antMatchers(HttpMethod.POST, Constants.permitAllArrayPOST).permitAll()
				.antMatchers(Constants.authenticatedArray).authenticated()
				.antMatchers(Constants.adminArray).hasRole("ADMIN")
				.anyRequest().authenticated()

			.and()

			.formLogin()
				.loginPage("/login")
				.successHandler(new MadeLoginSuccessHandler(userSecurityService, userRepository))
				.failureHandler(new MadeLoginFailureHandler())

			.and()

			.logout()
				.logoutUrl("/logout")
				.addLogoutHandler(new MadeLogoutHandler())
				.clearAuthentication(true)
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				// .deleteCookies("remember-me")
				.logoutSuccessUrl("http://localhost:3000")

			.and()

			.rememberMe().rememberMeParameter("remember").key("key")
				.alwaysRemember(false)
				// .rememberMeServices(new PersistentTokenRememberMeServices())
				.userDetailsService(userSecurityService)
				.tokenRepository(tokenRepository);

		return http.build();
	}


	@Bean
	public PersistentTokenRepository persistentTokenRepository(final PersistentLoginRepository repository){
		return new JpaPersistentTokenRepository(repository);
	}

	@Bean
	public ServletListenerRegistrationBean<HttpSessionListener> sessionListener() {
		return new ServletListenerRegistrationBean<>(new SessionListener());
	}

	@Bean
	public AuthenticationProvider daoAuthenticationProvider(){
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userSecurityService);
		authenticationProvider.setPasswordEncoder(encoder());
		authenticationProvider.setHideUserNotFoundExceptions(false); // 보안 취약해진다고 하는데, 일단 사용하는 것으로 함. 추후 수정할 것
		return authenticationProvider;
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

}
