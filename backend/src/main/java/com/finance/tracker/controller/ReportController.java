package com.finance.tracker.controller;

import com.finance.tracker.dto.ReportResponse;
import com.finance.tracker.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/{period}")
    public ResponseEntity<ReportResponse> generateReport(@PathVariable String period) {
        return ResponseEntity.ok(reportService.generateReport(period));
    }

    @GetMapping("/{period}/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable String period) throws Exception {
        byte[] pdf = reportService.exportPdf(period);
        String filename = URLEncoder.encode("report-" + period + ".pdf", StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", filename);
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/{period}/csv")
    public ResponseEntity<String> exportCsv(@PathVariable String period) throws UnsupportedEncodingException {
        String csv = reportService.exportCsv(period);
        String filename = URLEncoder.encode("report-" + period + ".csv", StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("filename", filename);
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }
}
