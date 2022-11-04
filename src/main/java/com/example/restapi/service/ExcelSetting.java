package com.example.restapi.service;

import java.lang.reflect.RecordComponent;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
public class ExcelSetting<DTO> {
	private DTO dto;
	private final String DEFAULT_FONT = "맑은 고딕";
	private final int DEFAULT_COLUMN_SIZE = 1000;
	private final int INT_COLUMN_SIZE = 2000;
	private final int STRING_COLUMN_SIZE = 5000;
	private final int DATE_COLUMN_SIZE = 7000;

	/**
	 * Excel Table Header Font Style
	 *
	 * @param workbook Excel file
	 * @param fontStyle Font name
	 * @param size Cell size
	 * @return XSSFFont fontHeader - style set
	 */
	public XSSFFont setFontHeader(XSSFWorkbook workbook, String fontStyle, short size){
		XSSFFont fontHeader = workbook.createFont();
			fontHeader.setFontName(fontStyle);
			fontHeader.setFontHeight((size));
			fontHeader.setBold(true);
		return fontHeader;
	}

	/**
	 * Excel Table Body Font Style
	 *
	 * @param workbook Excel file
	 * @param fontStyle Font name
	 * @param size Cell size
	 * @return XSSFFont font - style set
	 */
	public XSSFFont setFont(XSSFWorkbook workbook, String fontStyle, short size){
		XSSFFont font = workbook.createFont();
			font.setFontName(fontStyle);
			font.setFontHeight(size);
		return font;
	}

	/**
	 * Excel Table Header Style
	 *
	 * @param workbook Excel file
	 * @param fontHeader Header font
	 * @return CellStyle headerStyle - style set Cell
	 */
	public CellStyle headerStyle(XSSFWorkbook workbook, XSSFFont fontHeader){
		CellStyle headerStyle = workbook.createCellStyle();
			headerStyle.setAlignment(HorizontalAlignment.CENTER);
			headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			headerStyle.setBorderRight(BorderStyle.THIN);
			headerStyle.setBorderLeft(BorderStyle.THIN);
			headerStyle.setBorderTop(BorderStyle.THIN);
			headerStyle.setBorderBottom(BorderStyle.DOUBLE);
			headerStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			headerStyle.setFont(fontHeader);

		return headerStyle;
	}

	/**
	 * Excel Table Body Style
	 *
	 * @param workbook - Excel file
	 * @param font9 - Body font
	 * @return CellStyle bodyStyle - style set Cell
	 */
	public CellStyle bodyStyle(XSSFWorkbook workbook, XSSFFont font9){
		CellStyle bodyStyle = workbook.createCellStyle();
			bodyStyle.setAlignment(HorizontalAlignment.CENTER);
			bodyStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			bodyStyle.setBorderRight(BorderStyle.THIN);
			bodyStyle.setBorderLeft(BorderStyle.THIN);
			bodyStyle.setBorderTop(BorderStyle.THIN);
			bodyStyle.setBorderBottom(BorderStyle.THIN);
			bodyStyle.setFont(font9);

		return bodyStyle;
	}

	/**
	 * Write Excel file with Local database,
	 * and set HttpServletResponse to make an Excel file which is able to download on react app.
	 *
	 * @param response - HttpServletResponse
	 * @param getRecords - RecordComponent[] - DTO.class.getRecordComponents()
	 * @param dtoData - List of DTO
	 * @param dtoDataList - List of DTO.getData()
	 */
	public void writeWorkbook(HttpServletResponse response, RecordComponent[] getRecords, List<DTO> dtoData, List<List<String>> dtoDataList) {
		final String className = dtoData.get(0).getClass().getName().substring(43); // 43자 : com.example.restapi.model.network.response.
		final String EXCEL_NAME = "Board_" + className.substring(0,className.length() - 11) + ".xlsx"; // 11자 : ResponseDto
		final String sheetName = EXCEL_NAME.substring(0, EXCEL_NAME.length() - 5); // 5자 : .xlsx

		// 엑셀 헤더
		List<String> column = new ArrayList<>();
		List<Integer> columnWidth = new ArrayList<>();

		for (RecordComponent record : getRecords) {
			column.add(record.getName());

			Class<?> type = record.getType();

			if (Integer.class.equals(type)) {
				columnWidth.add(INT_COLUMN_SIZE);
			} else if (String.class.equals(type)) {
				columnWidth.add(STRING_COLUMN_SIZE);
			} else if (LocalDateTime.class.equals(type)) {
				columnWidth.add(DATE_COLUMN_SIZE);
			} else {
				columnWidth.add(DEFAULT_COLUMN_SIZE);
			}
		}

		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFCell cell = null;

		XSSFFont fontHeader = setFontHeader(workbook, DEFAULT_FONT, (short)(12 * 20));
		XSSFFont font10 = setFont(workbook, DEFAULT_FONT, (short)(10 * 20));

		CellStyle headerStyle = headerStyle(workbook, fontHeader);
		CellStyle bodyStyle = bodyStyle(workbook, font10);

		int rowCnt = 0;

		XSSFSheet sheet = workbook.createSheet(sheetName);
		XSSFRow row = sheet.createRow(rowCnt++);

		for (int i = 0; i < column.size(); i++) {
			cell = row.createCell(i);
			cell.setCellStyle(headerStyle);
			cell.setCellValue(column.get(i));
			sheet.setColumnWidth(i, columnWidth.get(i));
		}

		for (int k = 0; k < dtoData.size(); k++) {
			List<String> data = dtoDataList.get(k);
			int cellCnt = 0;
			row = sheet.createRow(rowCnt++);

			for (int i = 0; i < column.size(); i++) {
				cell = row.createCell(cellCnt++);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(data.get(i));
			}
		}
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition", "attachment;filename=" + EXCEL_NAME);
		try {
			workbook.write(response.getOutputStream());
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}
