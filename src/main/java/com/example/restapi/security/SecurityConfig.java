package com.example.restapi.security;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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
			.authorizeRequests()
			.antMatchers("/", "/user", "/userlogin/**").permitAll()
			.antMatchers(HttpMethod.GET, "/board", "/comment/**", "/category").permitAll()

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

							session.setAttribute("username", authentication.getName());
							System.out.println(session.getAttribute("username"));
							session.getAttribute("username");//세션 read
							response.addHeader("username", authentication.getName());
							// securityLoginWithoutLoginForm(request, authentication);
							response.sendRedirect("http://localhost:3000/board");
						}
					)
				.failureHandler((request, response, exception) -> {
						System.out.println("exception : " + exception.getMessage());
						response.sendRedirect("http://localhost:3000/login");
					}
				)
			.and()
			.logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
				.addLogoutHandler(new TaskImplementingLogoutHandler()).permitAll()
				.logoutSuccessUrl("/http://localhost:3000");

			// .and()
			//
			// .logout()
			// 	.deleteCookies("remove")
			// 	.invalidateHttpSession(false);
	}

	private void securityLoginWithoutLoginForm(HttpServletRequest req, Authentication auth) {
		//로그인 세션에 들어갈 권한을 설정합니다.
		List<GrantedAuthority> list = new ArrayList<GrantedAuthority>();
		list.add(new SimpleGrantedAuthority(auth.getAuthorities().toString()));

		SecurityContext sc = SecurityContextHolder.getContext();
		//아이디, 패스워드, 권한을 설정합니다. 아이디는 Object단위로 넣어도 무방하며
		//패스워드는 null로 하여도 값이 생성됩니다.
		sc.setAuthentication(new UsernamePasswordAuthenticationToken(auth, null, list));
		HttpSession session = req.getSession(true);

		//위에서 설정한 값을 Spring security에서 사용할 수 있도록 세션에 설정해줍니다.
		session.setAttribute(HttpSessionSecurityContextRepository.
			SPRING_SECURITY_CONTEXT_KEY, sc);
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
	//
	// @Bean
	// public UserDetailsService userDetailsService() {
	// 	PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
	// 	UserDetails user = User.withUsername("Lana")
	// 		.password(encoder.encode("anniversary1023"))
	// 		.roles("ADMIN")
	// 		.build();
	// 	return new InMemoryUserDetailsManager(user);
	// }

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
