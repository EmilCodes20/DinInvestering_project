package com.emil.investmentwebpage;
// Controlleren er den som henter inputs fra vores front end. Det bliver sendt ved hjælp af mit javascript script.
// Det her er altså hvor vi ligesom "griber" dataene og benytter logikken på den.
// Ligeledes er det også her, vi "sender bolden retur" ved benytte vores logik i CalcInvestment

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
     @Autowired
    private CalcInvestment calcInvestment;

    // This handles the root request and returns the HTML page
    @GetMapping("/")
    public String home() {
        return "index.html";  // This points to src/main/resources/static/index.html
    }

    // This handles the API call to calculate future investment value
    @GetMapping("/api/invest")
    @ResponseBody
    public double calculateInvestment(@RequestParam double initial,
                                      @RequestParam double monthly,
                                      @RequestParam double rate,
                                      @RequestParam int years) {

        return calcInvestment.calculateFutureValue(initial, monthly, rate, years);
        
    }

    
    @GetMapping("/api/invest/growth")
    @ResponseBody
    public List<Double> getGrowthData(@RequestParam double initial,
                                  @RequestParam double monthly,
                                  @RequestParam double rate,
                                  @RequestParam int years) {
    return calcInvestment.getYearlyGrowth(initial, monthly, rate, years);
    }

    
}
