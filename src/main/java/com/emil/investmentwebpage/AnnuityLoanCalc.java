package com.emil.investmentwebpage;

import org.springframework.stereotype.Service;


// Denne klasse står for at beregne alt hvad har det med lånsiden at gøre.
// Den bliver kaldt af min controller ved at lave en instans af klasse så vi dermed har adgang til metoderne.

@Service
public class AnnuityLoanCalc {
    public double calculateTimeLeft(double loan, double monthly, double annual_rate) {
        double r = annual_rate / 100 / 12;
        
        if (monthly <= loan * r) {
            throw new IllegalArgumentException("Monthly payment too low to ever pay off the loan.");
        }

        double time_left = (Math.log(monthly/(monthly-loan*r)))/(Math.log(1+r));

        return Math.ceil(time_left);

    }
    
}
