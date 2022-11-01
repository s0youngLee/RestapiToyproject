package com.example.restapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restapi.model.entity.Filedata;

@Repository
public interface FileRepository extends JpaRepository<Filedata, Integer> {
	List<Filedata> findAllByArticleId(Integer articleId);

	Filedata findBySaveFile(String saveFile);
}
