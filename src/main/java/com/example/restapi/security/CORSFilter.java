// package com.example.restapi.security;
//
// import static org.springframework.data.mapping.Alias.*;
//
// import java.io.IOException;
//
// import javax.servlet.Filter;
// import javax.servlet.FilterChain;
// import javax.servlet.FilterConfig;
// import javax.servlet.ServletException;
// import javax.servlet.ServletRequest;
// import javax.servlet.ServletResponse;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;
//
// import org.apache.logging.log4j.LogManager;
// import org.apache.logging.log4j.Logger;
// import org.springframework.core.Ordered;
// import org.springframework.core.annotation.Order;
// import org.springframework.stereotype.Component;
//
// @Component
// @Order(Ordered.HIGHEST_PRECEDENCE)
// public class CORSFilter implements Filter {
//
// 	private static final Logger LOGGER = LogManager.getLogger(CORSFilter.class.getName());
//
// 	@Override
// 	public void init(FilterConfig filterConfig) throws ServletException {
// 	}
//
// 	@Override
// 	public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws
// 		IOException, ServletException {
// 		final HttpServletRequest request = (HttpServletRequest) req;
// 		final HttpServletResponse response = (HttpServletResponse) res;
// 		final String origin = ((HttpServletRequest) req).getHeader("Origin");
//
// 		if (ofNullable(origin).isPresent() && origin.equals("http://localhost:3000")) {
// 			LOGGER.info("CORSFilter run");
// 			response.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
// 			response.addHeader("Access-Control-Allow-Credentials", "true");
//
// 			if (request.getHeader("Access-Control-Request-Method") != null && "OPTIONS".equals(request.getMethod())) {
// 				response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
// 				response.addHeader("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept,Authorization");
// 				response.setStatus(200);
// 			}
// 		}
// 		chain.doFilter(req, response);
// 	}
//
// 	@Override
// 	public void destroy() {
// 	}
// }