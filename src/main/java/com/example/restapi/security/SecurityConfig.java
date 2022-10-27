package com.example.restapi.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final UserSecurityService userSecurityService;
	public SecurityConfig(UserSecurityService userSecurityService) {
		this.userSecurityService = userSecurityService;
	}
	Logger logger = LoggerFactory.getLogger(MadeLogoutHandler.class);

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors().and()
			.csrf().disable()
			.httpBasic().disable()

			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)

			.and()

			.authorizeRequests()
			.antMatchers(HttpMethod.GET, Constants.permitAllArrayGET).permitAll()
			.antMatchers(HttpMethod.POST, Constants.permitAllArrayPOST).permitAll()
			.antMatchers(Constants.authenticatedArray).authenticated()
			.antMatchers(Constants.adminArray).hasRole("ADMIN")
			.anyRequest().permitAll()

			.and()

			.formLogin()
				.loginPage("/userlogin")
				.successHandler(new MadeLoginSuccessHandler(userSecurityService, logger))
				.failureHandler(new MadeLoginFailureHandler(logger))

			.and()

			.logout()
				.logoutUrl("/logout")
				.addLogoutHandler(new MadeLogoutHandler(logger))
				.deleteCookies("JSESSIONID")
				.clearAuthentication(true)
				.invalidateHttpSession(true)
				.logoutSuccessUrl("http://localhost:3000");

		return http.build();
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

}
