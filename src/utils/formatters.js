// Formatação numérica para padrão português

export const formatCurrency = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0 €';
  }
  // Formato português: 3.089.796.720 €
  const rounded = Math.round(num);
  const withDots = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${withDots} €`;
};

export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  // Formato português: 1.382.484
  const rounded = Math.round(num);
  const withDots = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return withDots;
};

export const formatDecimal = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0,00';
  }
  // Formato português: 1,50 (vírgula decimal)
  return num.toFixed(2).replace('.', ',');
};

export const formatPercent = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0,0%';
  }
  return `${parseFloat(num).toFixed(1).replace('.', ',')}%`;
};
