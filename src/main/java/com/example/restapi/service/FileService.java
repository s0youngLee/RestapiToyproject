package com.example.restapi.service;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.restapi.model.entity.Article;
import com.example.restapi.model.entity.Filedata;
import com.example.restapi.model.entity.UserInfo;
import com.example.restapi.model.network.response.ArticleExcelResponseDto;
import com.example.restapi.model.network.response.FileResponseDto;
import com.example.restapi.model.network.response.UserResponseDto;
import com.example.restapi.repository.ArticleRepository;
import com.example.restapi.repository.FileRepository;
import com.example.restapi.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class FileService {
	private final FileRepository fileRepository;
	private final ArticleRepository articleRepository;
	private final UserRepository userRepository;
	private final ExcelSetting excelSetting;

	private final int INT_COLUMN_SIZE = 3000;
	private final int STRING_COLUMN_SIZE = 5000;
	private final int DATE_COLUMN_SIZE = 7000;


	@Value("${upload.path}")
	private String uploadPath;


	public FileService(@Lazy FileRepository fileRepository, ArticleRepository articleRepository,
		UserRepository userRepository, ExcelSetting excelSetting) {
		this.fileRepository = fileRepository;
		this.articleRepository = articleRepository;
		this.userRepository = userRepository;
		this.excelSetting = excelSetting;
	}

	public List<FileResponseDto> getList(Article article){
		List<FileResponseDto> fileList = new ArrayList<>();
		for(Filedata file : fileRepository.findAllByArticleId(article.getId())){
			fileList.add(buildFile(file));
		}
		return fileList;
	}

	public List<Filedata> upload(List<MultipartFile> uploadFiles, Integer articleId) throws IOException {
		List<Filedata> fileList = new ArrayList<>();
		for (MultipartFile uploadFile : uploadFiles) {
			if(!uploadFile.getContentType().startsWith("image") && !uploadFile.getContentType().startsWith("application")) {
				log.warn("Invalid file type");
				return null;
			}

			String originalName = uploadFile.getOriginalFilename();
			String fileName = originalName.substring(originalName.lastIndexOf("//") + 1);
			log.info("fileName : " + fileName);

			//날짜 폴더 생성 - 폴더 용량 고려
			String folderPath = makeFolder();
			//UUID - 파일 덮어쓰기 방지
			String uuid = UUID.randomUUID().toString();
			String saveFile = uploadPath + File.separator + folderPath + File.separator;
			String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
			log.info("saveName : " + saveName);

			Path savePath = Paths.get(saveName);

			log.info(articleId);
			try{
				uploadFile.transferTo(savePath);
				Filedata newFile = Filedata.builder()
					.article(articleRepository.getReferenceById(articleId))
					.saveFile(saveFile)
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

	public FileResponseDto buildFile(Filedata file){
		return FileResponseDto.builder()
				.id(file.getId())
				.originName(file.getOriginName())
				.fileSize(file.getFileSize()/(1000000.0))
				.date(file.getDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
				.build();
	}

	private String makeFolder(){
		String folderPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

		File uploadPathFolder = new File(uploadPath, folderPath);

		if(!uploadPathFolder.exists()){
			uploadPathFolder.mkdirs();
		}
		return folderPath;
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

	public void downloadExcelBoard(HttpServletResponse response) {
		// list data 생성 - ArticleResponse id, title, created_id, created_at, final_edit_date
		List<ArticleExcelResponseDto> userData = new ArrayList<>();
		for(Article article: articleRepository.findAll()){
			ArticleExcelResponseDto body = ArticleExcelResponseDto.builder()
				.id(article.getId())
				.title(article.getTitle())
				.createdId(article.getCreatedId())
				.createdAt(article.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
				.finalEditDate(article.getFinalEditDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm:ss")))
				.build();
			userData.add(body);
		}

		//list data 존재하면 엑셀 파일 만들기
		if(userData.size() > 0){
			final String excelName = "boardList.xlsx";

			// 엑셀 헤더
			List<String> column = new ArrayList<>();
			log.info(ArticleExcelResponseDto.class.getFields());
			for(Field field : ArticleExcelResponseDto.class.getFields()){
				column.add(field.getName());
				log.info(field.getName());
			}
			// final Field[] fields = ArticleExcelResponseDto.class.getFields();
			// final String[] column = { "글 번호", "제목", "작성자", "작성일", "최종 수정일"};

			final int[] columnWidth = {3000, 5000, 5000, 7000, 7000};

			XSSFWorkbook workbook = new XSSFWorkbook();
			XSSFCell cell = null;

			XSSFFont fontHeader = excelSetting.setFontHeader(workbook, "한컴 말랑말랑 Bold", (short)(12 * 20));
			XSSFFont font10 = excelSetting.setFont(workbook, "한컴 말랑말랑 Regular", (short)(10 * 20));

			CellStyle headerStyle = excelSetting.headerStyle(workbook, fontHeader);
			CellStyle bodyStyle = excelSetting.bodyStyle(workbook, font10);
			//rows
			int rowCnt = 0;
			// int cellCnt = 0;

			XSSFSheet sheet = workbook.createSheet("Board_Article List");
			XSSFRow row = sheet.createRow(rowCnt++);

			for (int i = 0; i < column.size(); i++) {
				cell = row.createCell(i);
				cell.setCellStyle(headerStyle);
				cell.setCellValue(column.get(i));
				sheet.setColumnWidth(i, columnWidth[i]);
			}

			for(ArticleExcelResponseDto article : userData) {
				int cellCnt = 0;
				row = sheet.createRow(rowCnt++);

				// 글번호
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(article.id());
				// 제목
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(article.title());
				// 작성자
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(article.createdId());
				// 작성일
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(article.createdAt());
				// 최종수정일
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(article.finalEditDate());
			}

			wrtieExcel(response, workbook, excelName);

		}
	}

	public void wrtieExcel(HttpServletResponse response, XSSFWorkbook workbook, String excelName){
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition", "attachment;filename=" + excelName);
		try {
			workbook.write(response.getOutputStream());
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	public void downloadExcelUser(HttpServletResponse response) {
		// list data 생성 - ArticleResponse id, title, created_id, created_at, final_edit_date
		List<UserResponseDto> userData = new ArrayList<>();
		for(UserInfo user : userRepository.findAll()){
			UserResponseDto body = UserResponseDto.builder()
				.code(user.getCode())
				.name(user.getName())
				.email(user.getEmail())
				.nickName(user.getNickName())
				.phone(user.getPhone())
				.auth(user.getAuth())
				.build();
			userData.add(body);
		}

		//list data 존재하면 엑셀 파일 만들기
		if(userData.size() > 0) {
			final String excelName = "UserList.xlsx";

			// 엑셀 헤더
			final String[] column = {"번호", "이름", "이메일(ID)", "닉네임", "전화번호", "권한"};
			final int[] columnWidth = {3000, 4000, 5000, 4000, 7000, 3000};

			XSSFWorkbook workbook = new XSSFWorkbook();
			XSSFCell cell = null;

			XSSFFont fontHeader = excelSetting.setFontHeader(workbook, "한컴 말랑말랑 Bold", (short)(12 * 20));
			XSSFFont font10 = excelSetting.setFont(workbook, "한컴 말랑말랑 Regular", (short)(10 * 20));

			CellStyle headerStyle = excelSetting.headerStyle(workbook, fontHeader);
			CellStyle bodyStyle = excelSetting.bodyStyle(workbook, font10);
			//rows
			int rowCnt = 0;
			// int cellCnt = 0;

			XSSFSheet sheet = workbook.createSheet("Manage_User List");
			XSSFRow row = sheet.createRow(rowCnt++);

			for (int i = 0; i < column.length; i++) {
				cell = row.createCell(i);
				cell.setCellStyle(headerStyle);
				cell.setCellValue(column[i]);
				sheet.setColumnWidth(i, columnWidth[i]);
			}

			for (UserResponseDto user : userData) {
				int cellCnt = 0;
				row = sheet.createRow(rowCnt++);

				// 번호
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(user.code());
				// 이름
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(user.name());
				// 이메일(아이디)
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(user.email());
				// 닉네임
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(user.nickName());
				// 전화번호
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(user.phone());
				// 권한
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(user.auth().substring(5));
			}
			wrtieExcel(response, workbook, excelName);
		}
	}
}
