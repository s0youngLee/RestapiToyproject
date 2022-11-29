package com.example.restapi.security;

import java.util.Date;

public record CustomRememberMeToken(String username, String deviceSn, String tokenValue, Date date) {
}