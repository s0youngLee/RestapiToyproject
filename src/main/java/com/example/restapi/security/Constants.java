package com.example.restapi.security;

public final class Constants {
	// permit All
	public static final String[] permitAllArrayGET = new String[] {
		"/", "/userlogin", "/board/**", "/comment/**", "/category/**"
	};
	public static final String[] permitAllArrayPOST = new String[] {
		"/user", "/userlogin/**"
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
