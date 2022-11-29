package com.example.restapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restapi.model.entity.PersistentLoginMobile;

@Repository
public interface PersistentLoginMobileRepository extends JpaRepository<PersistentLoginMobile, String> {
	Optional<PersistentLoginMobile> findByDeviceSn(final String deviceSn);
	List<PersistentLoginMobile> findByUsername(final String username);
}