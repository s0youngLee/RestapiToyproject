package com.example.restapi.security;

public final class Constants {
	// permit All
	public static final String[] permitAllArrayGET = new String[] {
		"/", "/login", "/loginstatus", "/article/**", "/category", "/user", "/pageview/**"
	};
	public static final String[] permitAllArrayPOST = new String[] {
		"/login", "/user"
	};

	// authenticated(USER AND ADMIN)
	public static final String[] authenticatedArray = new String[] {
		"/logout","/user/**", "/article/**"
	};

	// ADMIN
	public static final String[] adminArray = new String[] {
		"/category/**", "/user/manage"
	};


}
