import InvoiceRow from "./InvoiceRow";

function InvoiceList({
  invoices,
  totalOpenInCents,
  draftAmountInCents,
  parsedMonths,
  draftPayoffLabel,
  formatCurrencyFromCents,
  getInstallmentAmountInCents,
  onUpdateInvoice,
  onDeleteInvoice,
  requestError,
}) {
  return (
    <section className="invoice-card" aria-label="Lista de faturas">
      <div className="invoice-header">
        <div>
          <span className="section-tag">Resumo</span>
          <h2>Faturas adicionadas</h2>
        </div>
        <span className="status-pill">{invoices.length} abertas</span>
      </div>

      <div className="invoice-total">
        <span>Total consolidado</span>
        <strong>{formatCurrencyFromCents(totalOpenInCents)}</strong>
      </div>

      <div className="summary-grid">
        <article>
          <span>Valor digitado agora</span>
          <strong>{formatCurrencyFromCents(draftAmountInCents)}</strong>
        </article>
        <article>
          <span>Prazo informado</span>
          <strong>{parsedMonths} meses</strong>
        </article>
        <article>
          <span>Previsao da nova quitacao</span>
          <strong>{draftPayoffLabel}</strong>
        </article>
      </div>

      <div className="timeline">
        <div className="timeline-header">
          <h3>Lista de cobrancas</h3>
          <span>Total e parcela mensal</span>
        </div>

        {requestError ? <p className="error">{requestError}</p> : null}

        <div className="timeline-list">
          {invoices.length === 0 ? (
            <div className="empty-state">
              <strong>Nenhuma fatura cadastrada.</strong>
              <p>Adicione a primeira fatura pelo formulario ao lado.</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                formatCurrencyFromCents={formatCurrencyFromCents}
                getInstallmentAmountInCents={getInstallmentAmountInCents}
                onUpdateInvoice={onUpdateInvoice}
                onDeleteInvoice={onDeleteInvoice}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default InvoiceList;
