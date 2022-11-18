package com.example.restapi.security;

public final class Constants {
	// permit All
	public static final String[] permitAllArrayGET = new String[] {
		"/", "/login", "/board", "/board/**", "/comment/**", "/category/**", "/loginstatus"
	};
	public static final String[] permitAllArrayPOST = new String[] {
		"/user", "/login",  "/login/**"
	};

	// authenticated(USER AND ADMIN)
	public static final String[] authenticatedArray = new String[] {
		"/logout","/user/**", "/board/**"
	};

	// ADMIN
	public static final String[] adminArray = new String[] {
		"/category/**", "/user/manage"
	};


}
