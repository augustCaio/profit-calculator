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

    // Percentuais de margem para comparação
    const marginPercentages = [0.3, 0.5, 0.7];

    const results = marginPercentages.map((desiredMargin) => {
      // Cálculo do preço de venda baseado na margem desejada
      // Fórmula: Receita = Custo / (1 - Margem Desejada)
      const salePrice = costPrice / (1 - desiredMargin);

      return {
        margin: `${desiredMargin * 100}%`,
        costPrice: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(costPrice),
        salePrice: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(salePrice),
        profit: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(salePrice - costPrice),
        profitPercentage: `${(
          ((salePrice - costPrice) / salePrice) *
          100
        ).toFixed(2)}%`,
      };
    });

    // Atualizar a tabela com resultados
    resultsBody.innerHTML = results
      .map(
        (result) => `
            <tr>
                <td class="p-2">${result.margin}</td>
                <td class="p-2">${result.costPrice}</td>
                <td class="p-2">${result.salePrice}</td>
                <td class="p-2">${result.profit}</td>
                <td class="p-2">${result.profitPercentage}</td>
            </tr>
        `
      )
      .join("");
  });
});
