const { format } = require('date-fns');
const ptBRLocale = require('date-fns/locale/pt-BR');

const formatDatePtBr = (date) => {
  const dateFormatted = format(date, 'dd/MM/yyyy', { locale: ptBRLocale })

  return dateFormatted
}

module.exports = {
  formatDatePtBr
}
