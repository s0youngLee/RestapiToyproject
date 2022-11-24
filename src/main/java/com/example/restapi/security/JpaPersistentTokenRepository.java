package com.example.restapi.security;

import java.util.Date;
import java.util.NoSuchElementException;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import com.example.restapi.model.entity.PersistentLogin;
import com.example.restapi.repository.PersistentLoginRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class JpaPersistentTokenRepository implements PersistentTokenRepository {

	private final PersistentLoginRepository repository;
	private final LoginService loginService;

	public JpaPersistentTokenRepository(final PersistentLoginRepository repository, LoginService loginService) {
		this.repository = repository;
		this.loginService = loginService;
	}

	// remember-me 쿠키 발급시 담을 토큰을 생성
	@Override
	public void createNewToken(final PersistentRememberMeToken token) {
		repository.save(PersistentLogin.from(token));
	}

	// 토큰을 변경할때 호출
	@Override
	public void updateToken(final String series, final String tokenValue, final Date lastUsed) {
		repository.findBySeries(series)
			.ifPresent(persistentLogin -> {
				persistentLogin.updateToken(tokenValue, lastUsed);
				repository.save(persistentLogin);
			});
	}

	// remember-me 쿠키를 이용한 인증 요청이 들어올 경우 호출
	// 쿠키에 담긴 시리즈로 데이터베이스를 검색
	@Override
	public PersistentRememberMeToken getTokenForSeries(final String seriesId) {
		try{
			log.info("Remember-Me Login Request : " + repository.findBySeries(seriesId).get().getUsername());
		}catch (NoSuchElementException e){
			log.warn("No User");
		}
		return repository.findBySeries(seriesId)
			.map(persistentLogin ->
				new PersistentRememberMeToken(
					persistentLogin.getUsername(),
					persistentLogin.getSeries(),
					persistentLogin.getToken(),
					persistentLogin.getLastUsed()
				))
			.orElseThrow(IllegalArgumentException::new);


	}

	// 로그아웃 할 경우 데이터베이스에서 영구 토큰 삭제
	@Override
	public void removeUserTokens(final String username) {
		repository.deleteAllInBatch(repository.findByUsername(username));
	}

}
