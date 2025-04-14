document.addEventListener("DOMContentLoaded", function () {
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
      fetchData(initial, monthly, rate, years);
    });
  });


    // Burger menu knap
    function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}

    
  
  // Denne funktion kalder på min Java Spring backend og får listen af yearly values og apsser dem videre til drawChart
  // funktionen som omdanner denne data til en graf.
  function fetchChartData(initial, monthly, rate, years) {
    fetch(`/api/invest/growth?initial=${initial}&monthly=${monthly}&rate=${rate}&years=${years}`)
        .then(response => response.json())
        .then(data => {
            drawChart(data);
        });
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

  function fetchData(initial, monthly, rate, years) {
    // Encode the inputs
    const initialEncoded = encodeURIComponent(initial);
    const monthlyEncoded = encodeURIComponent(monthly);
    const rateEncoded = encodeURIComponent(rate);
  
    fetch(`/api/invest?initial=${initialEncoded}&monthly=${monthlyEncoded}&rate=${rateEncoded}&years=${years}`)
      .then(response => response.text())
      .then(result => {

        // Her formatteres resultater til DKK og der skabes både tusind og mio. separatere
        const formattedResult = parseFloat(result).toLocaleString('da-DK', {
            style: 'currency',
            currency: 'DKK',
            minimumFractionDigits: 2,  // Ensures 2 decimal points
            maximumFractionDigits: 2   // Ensures 2 decimal points
        });

        document.getElementById("result").textContent = formattedResult;
      })
      .catch(err => {
        document.getElementById("result").textContent = "Something went wrong!";
        console.error(err);
      });
      fetchChartData(initial, monthly, rate, years);
  }
  

