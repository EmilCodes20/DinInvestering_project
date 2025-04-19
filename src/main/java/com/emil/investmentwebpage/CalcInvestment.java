package com.emil.investmentwebpage;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

// Denne klasse er den som beregner investeringen ud fra inputs
// Bruges ikke rigtig mere da jeg bruger min Growth metode nu fordi den fungerer med json
@Service
public class CalcInvestment {
    
    // Denne metode bruges til at beregne FV af inputs. Det er det som er outputtet
    public List<Double> calcFutureValue(double initial, double monthly, double rate, int years) {
    List<Double> yearlyValues = new ArrayList<>();
    double futureValue = initial;
    double monthlyRate = rate / 100 / 12;

    for (int year = 1; year <= years; year++) {
        for (int m = 0; m < 12; m++) {
            futureValue = (futureValue + monthly) * (1 + monthlyRate);
        }
        yearlyValues.add(futureValue);
    }

    return yearlyValues;
    }

}
