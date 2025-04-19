package com.emil.investmentwebpage;

public class ETFInfo {
    private String symbol;
    private String name;
    private double currentPrice;
    private double cagr;

    public ETFInfo(String symbol, String name, double currentPrice, double cagr) {
        this.symbol = symbol;
        this.name = name;
        this.currentPrice = currentPrice;
        this.cagr = cagr;
    }

    public String getSymbol() { return symbol; }
    public String getName() { return name; }
    public double getCurrentPrice() { return currentPrice; }
    public double getCagr() { return cagr; }

    
}
