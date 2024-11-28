import VMasker from "vanilla-masker";

document.addEventListener("DOMContentLoaded", () => {
  const serviceValueInput = document.getElementById("service-value");
  const calculateButton = document.getElementById("calculate-button");
  const resultsBody = document.getElementById("results-body");

  // Máscara monetária para o input
  VMasker(serviceValueInput).maskMoney({
    precision: 2,
    separator: ",",
    delimiter: ".",
    unit: "R$",
  });

  calculateButton.addEventListener("click", () => {
    const rawValue = serviceValueInput.value
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const costPrice = parseFloat(rawValue);

    if (isNaN(costPrice)) {
      alert("Por favor, insira um valor válido");
      return;
    }

    // Removi o 200% e mantive 50%, 70% e 100%
    const profitMargins = [0.5, 0.7, 1];

    const results = profitMargins.map((margin) => {
      // Fórmula: Preço de Venda = Custo do Produto / (1 - Margem de Lucro Desejada)
      const sellPrice = costPrice / (1 - margin);

      return {
        margin: `${margin * 100}%`,
        costPrice: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(costPrice),
        sellPrice: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(sellPrice),
        profit: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(sellPrice - costPrice),
      };
    });

    // Atualizar a tabela com resultados mais detalhados
    resultsBody.innerHTML = results
      .map(
        (result) => `
            <tr>
                <td class="p-2">${result.margin}</td>
                <td class="p-2">${result.costPrice}</td>
                <td class="p-2">${result.sellPrice}</td>
                <td class="p-2">${result.profit}</td>
            </tr>
        `
      )
      .join("");
  });
});
