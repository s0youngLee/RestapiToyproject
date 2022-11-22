package com.example.restapi.security;

import java.util.Date;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import com.example.restapi.model.entity.PersistentLogin;
import com.example.restapi.repository.PersistentLoginRepository;

public class JpaPersistentTokenRepository implements PersistentTokenRepository {

	private final PersistentLoginRepository repository;

	public JpaPersistentTokenRepository(final PersistentLoginRepository repository) {
		this.repository = repository;
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
		return repository.findBySeries(seriesId)
			.map(persistentLogin ->
				new PersistentRememberMeToken(
					persistentLogin.getUsername(),
					persistentLogin.getSeries(),
					persistentLogin.getToken(),
					persistentLogin.getExpiredDate()
				))
			.orElseThrow(IllegalArgumentException::new);
	}

	// 세션이 종료될 경우 데이터베이스에서 영구 토큰을 제거
	@Override
	public void removeUserTokens(final String username) {
		repository.deleteAllInBatch(repository.findByUsername(username));
	}

}
