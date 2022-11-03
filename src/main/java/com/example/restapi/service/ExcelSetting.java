package com.example.restapi.service;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
public class ExcelSetting {
	public XSSFFont setFontHeader(XSSFWorkbook workbook, String fontStyle, short size){
		XSSFFont fontHeader = workbook.createFont();
		fontHeader.setFontName(fontStyle);
		fontHeader.setFontHeight((size));
		// fontHeader.setBold(true);
		return fontHeader;
	}

	public XSSFFont setFont(XSSFWorkbook workbook, String fontStyle, short size){
		XSSFFont font = workbook.createFont();
		font.setFontName(fontStyle);
		font.setFontHeight(size);
		return font;
	}

	public CellStyle headerStyle(XSSFWorkbook workbook, XSSFFont fontHeader){
		// 엑셀 헤더 셋팅
		CellStyle headerStyle = workbook.createCellStyle();
		headerStyle.setAlignment(HorizontalAlignment.CENTER);
		headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		headerStyle.setBorderRight(BorderStyle.THIN);
		headerStyle.setBorderLeft(BorderStyle.THIN);
		headerStyle.setBorderTop(BorderStyle.THIN);
		headerStyle.setBorderBottom(BorderStyle.THIN);
		headerStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
		headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerStyle.setFont(fontHeader);

		return headerStyle;
	}

	public CellStyle bodyStyle(XSSFWorkbook workbook, XSSFFont font9){
		// 엑셀 바디 셋팅
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
}
