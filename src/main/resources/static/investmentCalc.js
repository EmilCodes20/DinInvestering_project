document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.fade');
    elements.forEach(function(element) {
      element.classList.add('fade-in');
    });

    const form = document.getElementById("investmentForm");
    const errorMessage = document.getElementById("error-message");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // prevent page reload
  
      // Henter værdierne som er input i HTML
      const initial = document.getElementById("initial").value;
      let monthly = document.getElementById("monthly").value;
      const rate = document.getElementById("rate").value;
      const years = document.getElementById("years").value;
  
      // Validere de inputs der er lavet - jeg har selv valgt hvad jeg tænker er relevant

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
  
      // Hide any previous error
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
  
    fetch(`/api/invest?initial=${initialEncoded}&monthly=${monthlyEncoded}&rate=${rateEncoded}&years=${yearsEncoded}`)
      .then(response => response.json())
      .then(data => {
        // Now, both growth and finalAmount are in the response data
        const growth = data.growth;
        const finalAmount = data.finalAmount;
        const effectiveRateofReturn = data.effectiveRateofReturn
        
        // Format the data for display
        console.log("Growth data:", growth);
        console.log("Final Amount:", finalAmount);
        console.log("Effective Rate of Return:", effectiveRateofReturn);
    
        
        // Draw the chart with the growth data
        drawChart(growth);  // Assuming you have a function to draw the chart with the growth data
        
        // Display the final amount formatted as currency
        document.getElementById("result").textContent = finalAmount.toLocaleString('da-DK', {
            style: 'currency',
            currency: 'DKK',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
      document.getElementById("effectiveRateofReturn").textContent = 
        `Gennemsnitlig årlig vækst: ${effectiveRateofReturn.toFixed(2)}%`;
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

// Denne funktion griber "canvas" elementet over i min HTML kode.
// Dernæst laver den labels og benytter Chart.js til at tegne min graf
// Jeg bruger den her fordi jeg gerne vil "ødelægge" nuærende graf hvis man nu inputter ny data
let chartInstance = null;

function drawChart(data) {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    const labels = data.map((_, i) => i + 1);

    if (chartInstance !== null) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Investering over tid',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
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


  

