package com.emil.investmentwebpage;

import org.springframework.stereotype.Service;

// Denne klasse er den som beregner investeringen ud fra inputs
@Service
public class CalcInvestment {
    public double calculateFutureValue(double initial, double monthly, double annualRate, int years) {
        // Convert annual rate to monthly rate
        double r = annualRate / 100 / 12;
        int months = years * 12;

        // Future value formula
        double futureValue = initial * Math.pow(1 + r, months);  // FV for initial investment
        futureValue += monthly * ((Math.pow(1 + r, months) - 1) / r);  // FV for monthly payments

        return futureValue;
    }
}
