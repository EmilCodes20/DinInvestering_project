document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.fade');
    elements.forEach(function(element) {
      element.classList.add('fade-in');
    });

    const form = document.getElementById("investmentForm");
    const errorMessage = document.getElementById("error-message");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // gør at siden ikke reloader
  
      // Henter værdierne som er input i HTML
      const initial = document.getElementById("initial").value;
      let monthly = document.getElementById("monthly").value;
      const rate = document.getElementById("rate").value;
      const years = document.getElementById("years").value;
  
      // Validere de inputs der er lavet - jeg har selv valgt hvad jeg tænker er relevant (den røde skrift)

      if (!initial) {
        errorMessage.textContent = "Venligst udfyld din initiale investering.";
        errorMessage.style.display = "block";
        return;
      }
  
      if (!rate) {
        errorMessage.textContent = "Venligst udfyld det gennemsnitlige årlige afkast.";
        errorMessage.style.display = "block";
        return;
      }
  
      if (monthly === "") {
        monthly = 0;
      }
  
      // Sletter tidligere fejlmeddelser
      errorMessage.style.display = "none";
  
      // Her kalder vi calculate formlen
      fetchData_investment(initial, monthly, rate, years);
    });
  });

  function fetchData_investment(initial, monthly, rate, years) {
    const initialEncoded = encodeURIComponent(initial);
    const monthlyEncoded = encodeURIComponent(monthly);
    const rateEncoded = encodeURIComponent(rate);
    const yearsEncoded = encodeURIComponent(years);
  
    // Først sender vi dataene efter de er ended til vores Java backed
    fetch(`/api/invest?initial=${initialEncoded}&monthly=${monthlyEncoded}&rate=${rateEncoded}&years=${yearsEncoded}`)
    // Når vi så får response fra serveren, så skal JS vide at det json
      .then(response => response.json())
      // Og så kan vi så bearbejde dataene ift. hvordan outputtet skal se ud
      .then(data => {
      
        const average = data.avgGrowth;
        const best = data.bestCase;
        const worst = data.worstCase;

        const finalAmount = data.finalAmount;
        const effectiveRateofReturn = data.effectiveRateofReturn
        
        // Her formatterer vi dataene så er den kan vises i HTML
        console.log("Avg Growth:", average);
        console.log("Best Case:", best);
        console.log("Worst Case:", worst);

        console.log("Final Amount:", finalAmount);
        console.log("Effective Rate of Return:", effectiveRateofReturn);
    
        
        // Her kalder vi vores graf function som tegner grafen ved hjælp af growth dataene
        drawChart(average, best, worst);
        
        // Den her er så hvad der kommer ind i HTML ved ID'et (såsom result)
        // Og den formatterer det til danske kroner
        document.getElementById("result").textContent = finalAmount.toLocaleString('da-DK', {
            style: 'currency',
            currency: 'DKK',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        // Her har vi så vores totale vækst af investeringen
      document.getElementById("effectiveRateofReturn").textContent = 
        `% vækst af Investeringen: ${effectiveRateofReturn.toFixed(2)}%`;
      })
      .catch(err => {
        document.getElementById("result").textContent = "Something went wrong!";
        console.error(err);
      });
}


    // Burger menu knap
    function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}



let chartInstance = null;
// Min drawchart funktion bruger chart.js til at lave grafen.
// Dne benytter dataene som er grebet af min fetchData funktion som den har fået fra min Backend
function drawChart(average, best, worst) {
    const ctx = document.getElementById('investmentChart').getContext('2d');

    if (chartInstance !== null) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: average.map((_, index) => index + 1),
            datasets: [{
                label: 'Gennemsnitlig',
                data: average,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.1
            },
            {
                label: 'Bedste',
                data: best,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                tension: 0.1
            },
            {
                label: 'Værste',
                data: worst,
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'År'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'kr.'
                }
              }
            }
          }
          
    });
}


  

