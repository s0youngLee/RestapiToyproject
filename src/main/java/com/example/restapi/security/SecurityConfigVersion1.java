// package com.example.restapi.security;
//
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
//
// import com.example.restapi.service.UserSecurityService;
//
// @Configuration
// @EnableWebSecurity
// // WebSecurityConfigurerAdapter : deprecated. 실습 후 @Bean 형태로 !!꼭!! 수정할 것
// public class SecurityConfig extends WebSecurityConfigurerAdapter {
// 	private final UserSecurityService userSecurityService;
// 	public SecurityConfig(UserSecurityService userSecurityService) {
// 		this.userSecurityService = userSecurityService;
// 	}
// 	Logger logger = LoggerFactory.getLogger(MadeLogoutHandler.class);
//
// 	@Override
// 	protected void configure(HttpSecurity http) throws Exception {
// 		http
// 			.cors().and()
// 			.csrf().disable();
//
// 		http.sessionManagement()
// 			.sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
//
// 		http
// 			.authorizeRequests()
// 			.antMatchers(HttpMethod.GET, Constants.permitAllArrayGET).permitAll()
// 			.antMatchers(HttpMethod.POST, Constants.permitAllArrayPOST).permitAll()
// 			.antMatchers(Constants.authenticatedArray).authenticated()
// 			.antMatchers(Constants.adminArray).hasRole("ADMIN")
// 			.anyRequest().authenticated();
//
// 		http
// 			.httpBasic().disable()
//
// 			.formLogin()
// 				.loginPage("/userlogin")
// 				.successHandler(new MadeLoginSuccessHandler(userSecurityService, logger))
// 				.failureHandler(new MadeLoginFailureHandler(logger))
//
// 			.and()
//
// 			.logout()
// 				.logoutUrl("/logout")
// 				.addLogoutHandler(new MadeLogoutHandler(logger))
// 				.deleteCookies("JSESSIONID")
// 				.clearAuthentication(true)
// 				.invalidateHttpSession(true)
// 				.logoutSuccessUrl("http://localhost:3000");
// 	}
//
// 	@Override
// 	public void configure(AuthenticationManagerBuilder auth) throws Exception {
// 		auth.userDetailsService(userSecurityService)
// 			.passwordEncoder(encoder());
// 	}
//
// 	@Bean
// 	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
// 		return authenticationConfiguration.getAuthenticationManager();
// 	}
//
// 	@Bean
// 	public PasswordEncoder encoder() {
// 		return new BCryptPasswordEncoder();
// 	}
//
// }
