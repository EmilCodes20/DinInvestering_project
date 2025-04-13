package com.emil.investmentwebpage;

public class Investment {
    private double initialInvestment;
    private double monthlyInvestment;
    private double annualRate;
    private int years;

    // Constructor, getters and setters
    public Investment(double initialInvestment, double monthlyInvestment, double annualRate, int years) {
        this.initialInvestment = initialInvestment;
        this.monthlyInvestment = monthlyInvestment;
        this.annualRate = annualRate;
        this.years = years;
    }

    // Getters and Setters
    public double getInitialInvestment() {
        return initialInvestment;
    }

    public void setInitialInvestment(double initialInvestment) {
        this.initialInvestment = initialInvestment;
    }

    public double getMonthlyInvestment() {
        return monthlyInvestment;
    }

    public void setMonthlyInvestment(double monthlyInvestment) {
        this.monthlyInvestment = monthlyInvestment;
    }

    public double getAnnualRate() {
        return annualRate;
    }

    public void setAnnualRate(double annualRate) {
        this.annualRate = annualRate;
    }

    public int getYears() {
        return years;
    }

    public void setYears(int years) {
        this.years = years;
    }
}

