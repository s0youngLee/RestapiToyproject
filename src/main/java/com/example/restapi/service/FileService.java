package com.example.restapi.service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import net.lingala.zip4j.ZipFile;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Filedata;
import com.example.restapi.model.network.response.FileResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.FileRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class FileService {
	private final FileRepository fileRepository;
	private final ArticleRepository articleRepository;

	@Value("${upload.path}")
	private String uploadPath;

	@Value("${zip.path}")
	private String zipPath;


	public FileService(@Lazy FileRepository fileRepository, ArticleRepository articleRepository) {
		this.fileRepository = fileRepository;
		this.articleRepository = articleRepository;
	}

	public List<Filedata> upload(List<MultipartFile> uploadFiles, Integer articleId) throws IOException {
		List<Filedata> fileList = new ArrayList<>();
		final String[] acceptFileType = new String[]{
			"image", "video", "audio", "text/plain",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"application/vnd.ms-powerpoint", "application/vnd.ms-excel",
			"application/pdf", "application/zip", "application/x-hwp", "application/haansofthwp"
		};

		for (MultipartFile uploadFile : uploadFiles) {
			if(!validFileType(acceptFileType, uploadFile)) {
				log.warn("Invalid file type : " + uploadFile.getOriginalFilename());
				return null;
			}

			String originalName = uploadFile.getOriginalFilename();
			String fileName = originalName.substring(originalName.lastIndexOf("//") + 1);
			log.info("fileName : " + fileName);

			//날짜 폴더 생성 - 폴더 용량 고려
			String folderPath = makeFolder();
			//UUID - 파일 덮어쓰기 방지
			String uuid = UUID.randomUUID().toString();
			String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;

			Path savePath = Paths.get(saveName);

			try{
				uploadFile.transferTo(savePath);
				Filedata newFile = Filedata.builder()
					.article(articleRepository.getReferenceById(articleId))
					.date(LocalDateTime.now())
					.fileSize(uploadFile.getSize())
					.originName(originalName)
					.saveName(saveName)
					.build();
				fileRepository.save(newFile);
				fileList.add(newFile);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return fileList;
	}

	public List<FileResponseDto> getList(Article article){
		List<FileResponseDto> fileList = new ArrayList<>();
		for(Filedata file : fileRepository.findAllByArticleId(article.getId())){
			fileList.add(buildFile(file));
		}
		return fileList;
	}

	public FileResponseDto buildFile(Filedata file){
		return FileResponseDto.builder()
			.id(file.getId())
			.originName(file.getOriginName())
			.fileSize(file.getFileSize()/(1000000.0))
			.date(file.getDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
			.build();
	}

	private String makeFolder(){
		// String folderPath = articleId + "-" + articleRepository.getReferenceById(articleId).getTitle();
		String folderPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
		File uploadPathFolder = new File(uploadPath, folderPath);

		if(!uploadPathFolder.exists()){
			uploadPathFolder.mkdirs();
		}
		return folderPath;
	}

	public boolean validFileType(String[] acceptList, MultipartFile file){
		boolean valid = false;
		for(int i=0;i<acceptList.length;i++){
			if(file.getContentType().startsWith(acceptList[i])){
				valid = true;
				break;
			}
		}
		return valid;
	}

	@Transactional
	public ResponseEntity<Resource> downloadFile(Integer id) {
		Filedata file = fileRepository.getReferenceById(id);

		Resource resource = new FileSystemResource(file.getSaveName());
		log.info("Download file : " + resource.getFilename());

		if(!resource.exists()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else{
			String resourceName = resource.getFilename();

			return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename="
					+ new String(resourceName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1))
				.body(resource);
		}
	}

	/**
	 * Delete Mapping("/board/{id}")
	 * 각 article에 연결된 file을 찾아 삭제함
	 *
	 * @param articleId id in table article
	 * @return X
	**/
	public void deleteFileByArticleId(int articleId){
		List<Filedata> fileList = fileRepository.findAllByArticleId(articleId);
		for(Filedata filedata: fileList) {
			File file = new File(filedata.getSaveName());
			file.delete();
		}
	}

	@Transactional
	public void deleteFile(Integer id) {
		try{
			File file = new File(fileRepository.getReferenceById(id).getSaveName());
			file.delete();
			fileRepository.deleteById(id);
		}catch (Exception e){
			log.error(e.getMessage());
		}
	}

	public ResponseEntity<Resource> downloadZipFile(int articleId) throws IOException {
		// 호출 시 해당 article에 upload 되어있는 모든 파일을 zip으로 압축한 파일을 생성하여 저장
		Article article = articleRepository.getReferenceById(articleId);

		List<File> filesInArticle = new ArrayList<>();
		Path movePath = Paths.get(zipPath);
		for(Filedata filedata : article.getFiles()){
			File originFile = new File(filedata.getSaveName());
			File forzipFile = new File(zipPath + File.separator + filedata.getOriginName());
			FileUtils.copyFile(originFile, forzipFile);

			File file = new File(zipPath + File.separator + filedata.getOriginName());
			filesInArticle.add(file);
		}

		ZipFile newZipFile = new ZipFile(article.getTitle()+".zip");
		newZipFile.addFiles(filesInArticle);

		Resource resource = new FileSystemResource(newZipFile.getFile());

		for(File file : filesInArticle){
			Path filePath = Paths.get(file.getAbsolutePath());
			Files.deleteIfExists(filePath);
		}

		if(!resource.exists()){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else{
			String resourceName = resource.getFilename();

			return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename="
					+ new String(resourceName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1))
				.body(resource);
		}
	}

	public void deleteZipFile(Integer articleId) throws IOException {
		Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + File.separator + articleRepository.getReferenceById(articleId).getTitle() + ".zip"));
		log.info(System.getProperty("user.dir") + File.separator + articleRepository.getReferenceById(articleId).getTitle() + ".zip");
	}
}
