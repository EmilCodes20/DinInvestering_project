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

    // Denne håndterer root requestet og returnerer HTML startsiden
    @GetMapping("/")
    public String home() {
        return "index.html";
    }

    // Denne griber lidt API requestet fra Javascript og dernæst kalder metoden for at beregne FV
    @GetMapping("api/invest")
    @ResponseBody
    public Map<String, Object> getInvestmentData(
            @RequestParam double initial,
            @RequestParam double monthly,
            @RequestParam double rate,
            @RequestParam int years) {

            // Man kunne undre sig hvorfor den ikke skal være 0.2 men den dividere med 100 i min Calc klasse
            double variance = 2.0;
    
        // Her laver jeg tre forskellige lister, da jeg gerne vil vise 3 forskellige grafer
        List<Double> avgGrowth = calcInvestment.getYearlyGrowth(initial, monthly, rate, years);
        List<Double> bestCase = calcInvestment.getYearlyGrowth(initial, monthly, rate+variance, years);
        List<Double> worstCase = calcInvestment.getYearlyGrowth(initial, monthly, rate-variance, years);

        double totalInvested = initial + (monthly * 12 * years);
        double effectiveRateofReturn = ((avgGrowth.get(avgGrowth.size() - 1) - totalInvested) / totalInvested) * 100;
    
        // Vi samler det hele i et Hashmap objekt så vi kan returnere til JS som JSON
        // Hash Map gemmer key-value i par, og når de bliver sendt via ResponseBody i Spring Boot vil det være i JSON.
        Map<String, Object> response = new HashMap<>();
        response.put("avgGrowth", avgGrowth);
        response.put("bestCase", bestCase);
        response.put("worstCase", worstCase);


        response.put("finalAmount", avgGrowth.get(avgGrowth.size() - 1));
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
