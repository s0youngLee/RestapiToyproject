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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.restapi.repository.PersistentLoginRepository;
import com.example.restapi.repository.UserRepository;
import com.example.restapi.service.UserSecurityService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Configuration
@CrossOrigin("http://localhost:3000 , http://192.168.1.158:3000")
@EnableWebSecurity
public class SecurityConfig {
	private final UserRepository userRepository;
	private final PersistentTokenRepository tokenRepository;
	private final LoginService loginService;
	public SecurityConfig(UserRepository userRepository, @Lazy PersistentTokenRepository tokenRepository,
		LoginService loginService) {
		this.userRepository = userRepository;
		this.tokenRepository = tokenRepository;
		this.loginService = loginService;
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
				// .sessionFixation().migrateSession()
				.maximumSessions(1)
				// .expiredUrl("접속중인 사용자 목록을 보여주는 관리자용 페이지")
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
				.successHandler(new MadeLoginSuccessHandler(userDetailsService(), userRepository))
				.failureHandler(new MadeLoginFailureHandler())

			.and()

			.logout()
				.logoutUrl("/logout")
				.addLogoutHandler(new MadeLogoutHandler())
				.clearAuthentication(true)
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				.deleteCookies("user")

			.and()

			.rememberMe().rememberMeParameter("remember")
				.userDetailsService(userDetailsService())
				.tokenRepository(tokenRepository);

		return http.build();
	}


	@Bean
	public PersistentTokenRepository persistentTokenRepository(final PersistentLoginRepository repository){
		return new JpaPersistentTokenRepository(repository, loginService);
	}

	@Bean
	public ServletListenerRegistrationBean<HttpSessionListener> sessionListener() {
		return new ServletListenerRegistrationBean<>(new SessionListener());
	}

	@Bean
	public AuthenticationProvider daoAuthenticationProvider(){
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService());
		authenticationProvider.setPasswordEncoder(encoder());
		authenticationProvider.setHideUserNotFoundExceptions(false); // 보안 취약해진다고 하는데, 일단 사용하는 것으로 함. 추후 수정할 것
		return authenticationProvider;
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return new UserSecurityService(userRepository);
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

}
