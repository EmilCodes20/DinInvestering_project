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
        errorMessage.textContent = "Please fill in the Initial Investment.";
        errorMessage.style.display = "block";
        return;
      }
  
      if (!rate) {
        errorMessage.textContent = "Please fill in the Annual Rate of Return.";
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
  
  function fetchData(initial, monthly, rate, years) {
    // Encode the inputs
    const initialEncoded = encodeURIComponent(initial);
    const monthlyEncoded = encodeURIComponent(monthly);
    const rateEncoded = encodeURIComponent(rate);
  
    fetch(`/api/invest?initial=${initialEncoded}&monthly=${monthlyEncoded}&rate=${rateEncoded}&years=${years}`)
      .then(response => response.text())
      .then(result => {
        document.getElementById("result").textContent = "$" + parseFloat(result).toFixed(2);
      })
      .catch(err => {
        document.getElementById("result").textContent = "Something went wrong!";
        console.error(err);
      });
  }
  