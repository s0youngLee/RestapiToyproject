package com.example.restapi.security;

import javax.servlet.http.HttpSessionListener;

import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.restapi.service.UserSecurityService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final UserSecurityService userSecurityService;
	private final LoginService loginService;
	public SecurityConfig(UserSecurityService userSecurityService, LoginService loginService) {
		this.userSecurityService = userSecurityService;
		this.loginService = loginService;
	}
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// session 만료 시 컨트롤 시도...? 수정 ****
		http
			.cors()
			.and()

			.csrf().disable()
			.httpBasic().disable()

			.sessionManagement(session -> {
				session.maximumSessions(5)
					.maxSessionsPreventsLogin(true);
			})
			.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
				.sessionFixation().migrateSession()
				.maximumSessions(30)
			.and()

			.and()

			.authorizeRequests()
				.antMatchers(HttpMethod.GET, Constants.permitAllArrayGET).permitAll()
				.antMatchers(HttpMethod.POST, Constants.permitAllArrayPOST).permitAll()
				.antMatchers(Constants.authenticatedArray).authenticated()
				.antMatchers(Constants.adminArray).hasRole("ADMIN")
				.anyRequest().permitAll()

			.and()

			.formLogin()
				.loginPage("/login")
				.successHandler(new MadeLoginSuccessHandler(userSecurityService))
				.failureHandler(new MadeLoginFailureHandler())

			.and()

			.logout()
				.logoutUrl("/logout")
				.addLogoutHandler(new MadeLogoutHandler())
				.clearAuthentication(true)
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				.logoutSuccessUrl("http://localhost:3000");

		return http.build();
	}

	@Bean
	public ServletListenerRegistrationBean<HttpSessionListener> sessionListener() {
		return new ServletListenerRegistrationBean<>(new SessionListener(loginService));
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

}
