// package com.example.restapi.security;
//
//
// import com.auth0.jwt.JWT;
// import com.auth0.jwt.algorithms.Algorithm;
// import com.example.restapi.model.entity.UserInfo;
//
// public class CreateJwt {
// 	public static String createAccessToken(UserInfo user) {
// 		return JWT.create()
// 			.withSubject(user.getUsername())
// 			//                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProperties.EXPIRATION_TIME))
// 			//                .withExpiresAt(new Date(System.currentTimeMillis() + 60000*10)
// 			.withClaim("username", user.getUsername())
// 			.sign(Algorithm.HMAC512(JwtProperties.SECRET));
// 	}
//
// 	public static String createRefreshToken(UserInfo user, String AccessToken) {
// 		return JWT.create()
// 			.withSubject(user.getUsername())
// 			//                .withExpiresAt(new Date(System.currentTimeMillis()+ 60000*100))
// 			.withClaim("AccessToken", AccessToken)
// 			.withClaim("username", user.getUsername())
// 			.sign(Algorithm.HMAC512(JwtProperties.SECRET));
// 	}
// }
