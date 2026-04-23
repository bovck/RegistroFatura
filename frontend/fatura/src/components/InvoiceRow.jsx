function InvoiceRow({
  invoice,
  formatCurrencyFromCents,
  getInstallmentAmountInCents,
}) {
  return (
    <article className="invoice-row">
      <div className="invoice-row-main">
        <span className="timeline-index">Credor</span>
        <strong>{invoice.creditor}</strong>
      </div>

      <div className="invoice-row-meta">
        <span>{invoice.months} meses</span>
        <span>Quita ate {invoice.payoffLabel}</span>
      </div>

      <div className="timeline-value">
        <span className="timeline-value-total">
          {formatCurrencyFromCents(invoice.totalAmountInCents)}
        </span>
        <span className="timeline-value-installment">
          {formatCurrencyFromCents(
            getInstallmentAmountInCents(
              invoice.totalAmountInCents,
              invoice.months,
            ),
          )}{' '}
          / parcela
        </span>
      </div>
    </article>
  )
}

export default InvoiceRow
