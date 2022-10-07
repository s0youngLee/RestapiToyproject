package com.example.restapi.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CharacterEncodingFilter;

@Configuration
@EnableWebSecurity
// WebSecurityConfigurerAdapter : deprecated. 실습 후 @Bean 형태로 !!꼭!! 수정할 것
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		CharacterEncodingFilter filter = new CharacterEncodingFilter();

		http.csrf().disable();
		http
			.authorizeRequests()
			.antMatchers("/", "/login/**").permitAll()
			.antMatchers("/board/**", "/category/**", "/comment/**").authenticated()
			.anyRequest().authenticated()

			.and()

			.httpBasic().disable()
			.formLogin()
				.loginPage("/login")
				.successHandler((request, response, authentication) -> {
						System.out.println("authentication : " + authentication.getName());
						response.sendRedirect("http://localhost:3000/board");
					}
				)
				.failureHandler((request, response, exception) -> {
					System.out.println("exception : " + exception.getMessage());
					response.sendRedirect("http://localhost:3000");
				})

			.and()

			// logout 부분 작성하기, login, logout 완료되면 member table과 연결하기
			.logout()
				.logoutUrl("http://localhost:3000");


	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE"));
		configuration.setAllowedHeaders(Arrays.asList("Access-Control-Allow-Origin : *"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}
