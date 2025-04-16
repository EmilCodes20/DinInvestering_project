package com.emil.investmentwebpage;
// Controlleren er den som henter inputs fra vores front end. Det bliver sendt ved hjælp af mit javascript script.
// Det her er altså hvor vi ligesom "griber" dataene og benytter logikken på den.
// Ligeledes er det også her, vi "sender bolden retur" ved benytte vores logik i CalcInvestment

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    // Laver et objekt af min CalcInvestment klasse - Det er langt nemmere i Spring Boot
     @Autowired
    private CalcInvestment calcInvestment;

    // This handles the root request and returns the HTML page
    @GetMapping("/")
    public String home() {
        return "index.html";  // This points to src/main/resources/static/index.html
    }

    @GetMapping("api/invest")
    @ResponseBody
    public Map<String, Object> getInvestmentData(
            @RequestParam double initial,
            @RequestParam double monthly,
            @RequestParam double rate,
            @RequestParam int years) {
    
        List<Double> growth = calcInvestment.getYearlyGrowth(initial, monthly, rate, years);
        double totalInvested = initial + (monthly * 12 * years);
        double effectiveRateofReturn = ((growth.get(growth.size() - 1) - totalInvested) / totalInvested) * 100;
    
        Map<String, Object> response = new HashMap<>();
        response.put("growth", growth);
        response.put("finalAmount", growth.get(growth.size() - 1)); // Use the last value as future value
        response.put("effectiveRateofReturn", effectiveRateofReturn);
    
        return response;
    }
    

    // Laver et objekt af min AnnuityCalc
    @Autowired
    private AnnuityLoanCalc annuityLoanCalc;

    // Denne griber lidt API requestet fra Javascript og dernæst kalder metoden for at beregne lånets tid.
    @GetMapping("api/loan")
    @ResponseBody
    public Map<String, Object> annuityLoanCalc(@RequestParam double loan,
    @RequestParam double monthly, @RequestParam double rate) {
        double months = annuityLoanCalc.calculateTimeLeft(loan, monthly, rate);
       
        // Vi opretter et JSON objekt af vores respons
        Map<String, Object> response = new HashMap<>();
        response.put("totalMonths",monthly);
        response.put("years", (int) (months/12));
        response.put("remainingMonths", (int) (months%12));
        
        return response;

    }
}
