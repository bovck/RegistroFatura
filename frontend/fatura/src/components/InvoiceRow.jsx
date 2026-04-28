import { useState } from "react";

function InvoiceRow({
  invoice,
  formatCurrencyFromCents,
  getInstallmentAmountInCents,
  onUpdateInvoice,
  onDeleteInvoice,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [editCreditor, setEditCreditor] = useState(invoice.creditor);
  const [editAmount, setEditAmount] = useState(
    String(invoice.totalAmountInCents / 100),
  );
  const [editMonths, setEditMonths] = useState(String(invoice.months));

  function resetDraft() {
    setEditCreditor(invoice.creditor);
    setEditAmount(String(invoice.totalAmountInCents / 100));
    setEditMonths(String(invoice.months));
  }

  async function handleSave(event) {
    event.preventDefault();

    const cleanCreditor = editCreditor.trim();
    const parsedAmount = Number(editAmount);
    const parsedMonths = Math.max(1, Number(editMonths) || 1);

    if (!cleanCreditor || parsedAmount <= 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateInvoice({
        id: invoice.id,
        creditor: cleanCreditor,
        amount: parsedAmount,
        months: parsedMonths,
      });
      setActionError("");
      setIsExpanded(false);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    resetDraft();
    setActionError("");
    setIsExpanded(false);
  }

  function handleToggleExpand() {
    if (!isExpanded) {
      resetDraft();
      setActionError("");
    }

    setIsExpanded((currentState) => !currentState);
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      await onDeleteInvoice(invoice.id);
    } catch (error) {
      setActionError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <article className={`invoice-row${isExpanded ? " is-expanded" : ""}`}>
      <button
        className="invoice-row-trigger"
        type="button"
        onClick={handleToggleExpand}
        aria-expanded={isExpanded}
      >
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
            )}{" "}
            / parcela
          </span>
        </div>
      </button>

      {isExpanded ? (
        <form className="invoice-editor" onSubmit={handleSave}>
          <label className="field">
            <span>Credor</span>
            <input
              type="text"
              value={editCreditor}
              onChange={(event) => setEditCreditor(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </label>

          <label className="field">
            <span>Valor total</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editAmount}
              onChange={(event) => setEditAmount(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </label>

          <label className="field">
            <span>Meses</span>
            <input
              type="number"
              min="1"
              step="1"
              value={editMonths}
              onChange={(event) => setEditMonths(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </label>

          {actionError ? <p className="error">{actionError}</p> : null}

          <div className="invoice-editor-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              Salvar
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Excluir
            </button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

export default InvoiceRow;
