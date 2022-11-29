package com.example.restapi.model.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.restapi.model.network.request.UserRequest;

import lombok.Builder;

@Entity
@Builder
public class UserInfo implements UserDetails {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Integer code;
	private String email;
	private String password;
	private String auth;
	private String nickName;
	private String name;
	private String phone;

	private LocalDateTime lastAccess;

	public UserInfo() {

	}

	public UserInfo(Integer code, String email, String password, String auth, String nickName, String name,
		String phone, LocalDateTime lastAccess) {
		this.code = code;
		this.email = email;
		this.password = password;
		this.auth = auth;
		this.nickName = nickName;
		this.name = name;
		this.phone = phone;
		this.lastAccess = lastAccess;
	}

	public void update(UserRequest request){
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		this.nickName = !Objects.equals(request.getNickName(), "") ? request.getNickName() : this.nickName;
		this.phone = !Objects.equals(request.getPhone(), "") ? request.getPhone() : this.phone;
		this.password = !Objects.equals(request.getPassword(), "") ? encoder.encode(request.getPassword()) : this.password;
	}

	public void updateAuth(UserRequest request){
		this.auth = request.getAuth();
	}

	public void updateLastAccess(){
		this.lastAccess = LocalDateTime.now();
	}

	public Integer getCode() {
		return code;
	}

	public String getAuth() {
		return auth;
	}

	public String getNickName() {
		return nickName;
	}

	public String getName() {
		return name;
	}

	public String getPhone() {
		return phone;
	}

	public LocalDateTime getLastAccess() {
		return lastAccess;
	}

	// 사용자의 권한을 콜렉션 형태로 반환
	// 단, 클래스 자료형은 GrantedAuthority를 구현해야함
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> roles = new HashSet<>();
		for (String role : auth.split(",")) {
			roles.add(new SimpleGrantedAuthority(role));
		}
		return roles;
	}

	// 사용자의 id를 반환 (unique한 값)
	@Override
	public String getUsername() {
		return email;
	}

	// 사용자의 password 반환
	@Override
	public String getPassword() {
		return password;
	}

	// 계정 만료 여부 반환
	@Override
	public boolean isAccountNonExpired() {
		// 만료되었는지 확인하는 로직
		return true; // true -> 만료되지 않았음
	}

	// 계정 잠금 여부 반환
	@Override
	public boolean isAccountNonLocked() {
		// 계정 잠금되었는지 확인하는 로직
		return true; // true -> 잠금되지 않았음
	}

	// 패스워드의 만료 여부 반환
	@Override
	public boolean isCredentialsNonExpired() {
		// 패스워드가 만료되었는지 확인하는 로직
		return true; // true -> 만료되지 않았음
	}

	// 계정 사용 가능 여부 반환
	@Override
	public boolean isEnabled() {
		// 계정이 사용 가능한지 확인하는 로직
		return true; // true -> 사용 가능
	}
}