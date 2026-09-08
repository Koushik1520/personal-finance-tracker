package com.finance.tracker.util;

import com.finance.tracker.dto.ReportResponse;
import com.lowagie.text.Document;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;

@Component
public class ReportExportUtil {

    public byte[] exportToPdf(ReportResponse report) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();
        document.add(new com.lowagie.text.Paragraph("Financial Report - " + report.getPeriod()));
        document.add(new com.lowagie.text.Paragraph("Total Income: " + report.getTotalIncome()));
        document.add(new com.lowagie.text.Paragraph("Total Expenses: " + report.getTotalExpenses()));
        document.add(new com.lowagie.text.Paragraph("Net Savings: " + report.getNetSavings()));
        document.add(new com.lowagie.text.Paragraph(" "));
        document.add(new com.lowagie.text.Paragraph("Category Wise Spending:"));
        Table table = new Table(2);
        table.addCell("Category");
        table.addCell("Amount");
        for (var entry : report.getCategoryWiseSpending()) {
            table.addCell((String) entry.get("category"));
            table.addCell(entry.get("amount").toString());
        }
        document.add(table);
        document.close();
        return out.toByteArray();
    }

    public String exportToCsv(ReportResponse report) {
        StringBuilder sb = new StringBuilder();
        sb.append("Category,Amount\n");
        for (var entry : report.getCategoryWiseSpending()) {
            sb.append(entry.get("category")).append(",").append(entry.get("amount")).append("\n");
        }
        sb.append("\nDaily Data\n");
        sb.append("Date,Amount\n");
        for (var entry : report.getDailyData()) {
            sb.append(entry.get("date")).append(",").append(entry.get("amount")).append("\n");
        }
        return sb.toString();
    }
}
