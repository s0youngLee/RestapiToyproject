package com.example.restapi.security;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.restapi.service.UserSecurityService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final UserSecurityService userSecurityService;
	public SecurityConfig(UserSecurityService userSecurityService) {
		this.userSecurityService = userSecurityService;
	}
	Logger logger = LoggerFactory.getLogger(MadeLogoutHandler.class);

	protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http

			.csrf().disable()
			.httpBasic().disable()

			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)

			.and()
			// .addFilter(corsFilter())
			// .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)

			.authorizeRequests()
			.requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
			.antMatchers(HttpMethod.GET, Constants.permitAllArrayGET).permitAll()
			.antMatchers(HttpMethod.POST, Constants.permitAllArrayPOST).permitAll()
			.antMatchers(Constants.authenticatedArray).authenticated()
			.antMatchers(Constants.adminArray).hasRole("ADMIN")
			.anyRequest().permitAll().and()
			.cors()

			.and()

			.authenticationProvider(authenticationProvider())

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

	// @Bean
	// public WebSecurityCustomizer webSecurityCustomizer() {
	// 	return (web) -> web.ignoring()
	// 		.antMatchers(Constants.permitAllArrayGET);
	// }

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		final CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("*"));
		configuration.setAllowedMethods(List.of("*"));
		configuration.setAllowedHeaders(List.of("*"));

		configuration.addAllowedOrigin("*");
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");

		configuration.setAllowCredentials(true);

		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	//
	// @Bean
	// public CorsFilter corsFilter(){
	// 	final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	// 	CorsConfiguration configuration = new CorsConfiguration();
	// 	configuration.setAllowCredentials(true);
	// 	configuration.addAllowedOriginPattern("*");
	// 	configuration.addAllowedHeader("*");
	// 	configuration.addAllowedMethod("*");
	// 	source.registerCorsConfiguration("/**", configuration);
	// 	return new CorsFilter();
	// }

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

		authProvider.setUserDetailsService(userSecurityService);
		authProvider.setPasswordEncoder(encoder());

		return authProvider;
	}

	// @Bean
	// public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
	// 	return authenticationConfiguration.getAuthenticationManager();
	// }

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder encoder, UserSecurityService userSecurityService ) throws Exception {
		return http.getSharedObject(AuthenticationManagerBuilder.class)
			.userDetailsService(userSecurityService)
			.passwordEncoder(encoder)
			.and().build();
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

}
