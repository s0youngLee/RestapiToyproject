// package com.example.restapi.security;
//
// import static org.springframework.security.config.Customizer.*;
//
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;
//
// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {
//
// 	@Bean
// 	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
// 		http
// 			.authorizeHttpRequests((authz) -> authz
// 				.anyRequest().authenticated()
// 			)
// 			// .cors().and()
// 			.httpBasic(withDefaults());
// 				// // .loginPage("/member")
// 				// .defaultSuccessUrl("/")
// 				// .failureUrl("/member")
// 				// .usernameParameter("username")
// 				// .passwordParameter("password")
// 				// .loginProcessingUrl("/member/login")
// 				// .successHandler(new AuthenticationSuccessHandler() {
// 				// 	@Override
// 				// 	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
// 				// 		Authentication authentication) throws IOException, ServletException {
// 				// 		System.out.println("authentication : " + authentication.getName());
// 				// 		response.sendRedirect("/");
// 				// 	}
// 				// })
// 				// .failureHandler(new AuthenticationFailureHandler() {
// 				// 	@Override
// 				// 	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
// 				// 		AuthenticationException exception) throws IOException, ServletException {
// 				// 		System.out.println("exception : " + exception.getMessage());
// 				// 		response.sendRedirect("/login");
// 				// 	}
// 				// })
// 				// .permitAll();
// 		return http.build();
// 	}
//
// 	// @Bean
// 	// public CorsConfigurationSource corsConfigurationSource() {
// 	// 	CorsConfiguration configuration = new CorsConfiguration();
// 	//
// 	// 	configuration.addAllowedOriginPattern("*");
// 	// 	configuration.addAllowedHeader("*");
// 	// 	configuration.addAllowedMethod("*");
// 	// 	configuration.setAllowCredentials(true);
// 	//
// 	// 	UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
// 	// 	source.registerCorsConfiguration("/**", configuration);
// 	// 	return source;
// 	// }
//
// 	// @Override
// 	// public void onStartup(ServletContext sc){
// 	// 	AnnotationConfigApplicationContext root = new AnnotationConfigApplicationContext();
// 	// 	root.register(SecurityConfig.class);
// 	//
// 	// 	sc.addListener(new ContextLoaderListener(root));
// 	// 	sc.addFilter("securityFileter", new DelegatingFilterProxy("springSecurityFilterChain"))
// 	// 		.addMappingForUrlPatterns(null, false, "/*");
// 	// }
// }
