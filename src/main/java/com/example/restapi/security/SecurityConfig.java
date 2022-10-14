package com.example.restapi.security;

import java.util.Arrays;

import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.restapi.service.UserService;

@Configuration
@EnableWebSecurity
// WebSecurityConfigurerAdapter : deprecated. 실습 후 @Bean 형태로 !!꼭!! 수정할 것
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	private final UserService userService;
	public SecurityConfig(UserService userService) {
		this.userService = userService;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.csrf().disable();
		http
			//나중에 하드코딩방식 리팩토링하기
			.authorizeRequests()
			.antMatchers("/", "/user", "/userlogin/**").permitAll()
			.antMatchers(HttpMethod.GET, "/board/**", "/comment/**", "/category").permitAll()

			.antMatchers("/userlogin?logout").access("hasRole('ADMIN') or hasRole('USER')")
			.antMatchers(HttpMethod.POST, "/board/**").access("hasRole('ADMIN') or hasRole('USER')")
			.antMatchers(HttpMethod.PUT, "/board/**").access("hasRole('ADMIN') or hasRole('USER')")
			.antMatchers(HttpMethod.DELETE, "/board/**").access("hasRole('ADMIN') or hasRole('USER')")

			.antMatchers(HttpMethod.POST, "/category/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.PUT, "/category/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.DELETE, "/category/**").hasRole("ADMIN")
			.anyRequest().authenticated()

			.and()

			.httpBasic().disable()

			.formLogin()
				.loginPage("/userlogin").permitAll()
				.successHandler((request, response, authentication) -> {
							HttpSession session = request.getSession();
							System.out.println("authentication : " + authentication.getName());
							response.sendRedirect("http://localhost:3000/board");
						}
					)
				.failureHandler((request, response, exception) -> {
						System.out.println("exception : " + exception.getMessage());
						response.sendRedirect("http://localhost:3000");
					}
				)
			.and()
			.logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
				.addLogoutHandler(new TaskImplementingLogoutHandler()).permitAll()
				.deleteCookies("remove")
				.invalidateHttpSession(false)
				.logoutSuccessUrl("/http://localhost:3000");
	}


	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userService)
			.passwordEncoder(new BCryptPasswordEncoder(16));
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}


	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		configuration.setAllowedMethods(Arrays.asList("*"));
		configuration.setAllowedHeaders(Arrays.asList("Access-Control-Allow-Origin : *"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}
