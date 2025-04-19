package com.emil.investmentwebpage;

import com.emil.investmentwebpage.ETFInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class FinanceService {

    private static final String API_KEY = "EK1M11QETVU8UAN6";
    private static final ObjectMapper mapper = new ObjectMapper();

    public double getCurrentPrice(String symbol) throws Exception {
        String urlString = String.format(
            "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s",
            URLEncoder.encode(symbol, StandardCharsets.UTF_8),
            API_KEY
        );
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");

        try (InputStream inputStream = conn.getInputStream()) {
            JsonNode root = mapper.readTree(inputStream);
            JsonNode quote = root.path("Global Quote");
            return quote.path("05. price").asDouble();
        }
    }

    public double getAverageAnnualReturn(String symbol, int years) throws Exception {
        String urlString = String.format(
            "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=%s&apikey=%s",
            URLEncoder.encode(symbol, StandardCharsets.UTF_8),
            API_KEY
        );

        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");

        try (InputStream inputStream = conn.getInputStream()) {
            JsonNode root = mapper.readTree(inputStream);
            JsonNode timeSeries = root.path("Monthly Adjusted Time Series");

            if (timeSeries.isMissingNode()) {
                throw new RuntimeException("Missing time series data from Alpha Vantage");
            }

            Iterator<Map.Entry<String, JsonNode>> entries = timeSeries.fields();
            double latest = 0, earliest = 0;
            int count = 0;

            while (entries.hasNext() && count < years * 12) {
                Map.Entry<String, JsonNode> entry = entries.next();
                double close = entry.getValue().path("5. adjusted close").asDouble();

                if (count == 0) {
                    latest = close;
                }
                earliest = close;
                count++;
            }

            if (earliest == 0) {
                throw new RuntimeException("Not enough data to calculate return");
            }

            double averageReturn = Math.pow(latest / earliest, 1.0 / years) - 1;
            return averageReturn * 100;
        }
    }

    // Optionally return a nicer name (if needed, you can improve this later)
    public String getEtfName(String symbol) {
        // Dummy fallback name; could improve by storing static map of names
        return symbol;
    }

    public List<ETFInfo> getTopEtfsInfo(List<String> symbols, int years) {
        List<ETFInfo> result = new ArrayList<>();
        for (String symbol : symbols) {
            try {
                double price = getCurrentPrice(symbol);
                double cagr = getAverageAnnualReturn(symbol, years);
                String name = getEtfName(symbol); // Optional
                result.add(new ETFInfo(symbol, name, price, cagr));
            } catch (Exception e) {
                System.err.println("Failed to fetch data for " + symbol + ": " + e.getMessage());
            }
        }

        result.sort(Comparator.comparingDouble(ETFInfo::getCagr).reversed());
        return result;
    }
}
