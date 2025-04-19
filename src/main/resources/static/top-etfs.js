document.addEventListener("DOMContentLoaded", () => {
    const etfBody = document.getElementById("etfBody");
    const etfTable = document.getElementById("etfTable");
    const loading = document.getElementById("loading");
  
    fetch("/api/top-etfs")
      .then((res) => res.json())
      .then((data) => {
        if (!data.length) {
          loading.textContent = "Ingen data fundet.";
          return;
        }
  
        data.forEach((etf) => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
            <td>${etf.symbol}</td>
            <td>${etf.name}</td>
            <td>${etf.currentPrice.toFixed(2)}</td>
            <td>${etf.cagr.toFixed(2)}%</td>
          `;
  
          etfBody.appendChild(row);
        });
  
        loading.style.display = "none";
        etfTable.style.display = "table";
      })
      .catch((err) => {
        console.error("Fejl ved hentning:", err);
        loading.textContent = "Der opstod en fejl ved hentning af data.";
      });
  });
  