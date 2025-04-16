document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.fade');
    elements.forEach(function(element) {
      element.classList.add('fade-in');
    });

    const form = document.getElementById("loanForm");
    const errorMessage = document.getElementById("error-message");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // prevent page reload
  
      // Henter værdierne som er input i HTML
      const loan = document.getElementById("loan").value;
      const monthly = document.getElementById("monthly").value;
      const rate = document.getElementById("rate").value;
  
      // Validere de inputs der er lavet - jeg har selv valgt hvad jeg tænker er relevant

      if (!loan) {
        errorMessage.textContent = "Venligst udfyld din gæld.";
        errorMessage.style.display = "block";
        return;
      }
  
      if (!rate) {
        errorMessage.textContent = "Venligst udfyld lånets rente.";
        errorMessage.style.display = "block";
        return;
      }
  
      if (!monthly) {
        errorMessage.textContent = "Venligst udfyld den månedlige ydelse.";
        errorMessage.style.display = "block";
        return;
      }
  

      errorMessage.style.display = "none";
  
      // Her kalder vi calculate formlen
      fetchData_loan(loan, monthly, rate);
    });
  });


    // Burger menu knap
    function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}
// Meget samme logik som i InvestmentCalc.js
function fetchData_loan(loan, monthly, rate) {
   
    const loanEncoded = encodeURIComponent(loan);
    const monthlyEncoded = encodeURIComponent(monthly);
    const rateEncoded = encodeURIComponent(rate);
  
    fetch(`/api/loan?loan=${loanEncoded}&monthly=${monthlyEncoded}&rate=${rateEncoded}`)
      .then(response => response.json())
      .then(data => {
        
        const totalMonths = data.totalMonths;
        const years = data.years;
        const remainingMonths = data.remainingMonths;
        
        // Her formatterer vi outputtet til at se pænt ud
        let formattedTime = "";
        if (years > 0) {
            formattedTime += `${years} år`;
        }
        if (remainingMonths > 0) {
            formattedTime += years > 0 ? ` og ${remainingMonths} måneder` : `${remainingMonths} måneder`;
        }

        document.getElementById("result").textContent = formattedTime;
      })
      .catch(err => {
        document.getElementById("result").textContent = "Something went wrong!";
        console.error(err);
      });
}



