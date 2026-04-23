function InvoiceForm({
  creditor,
  amount,
  months,
  draftAmountInCents,
  onCreditorChange,
  onAmountChange,
  onMonthsChange,
  onSubmit,
  formatCurrencyFromCents,
}) {
  const url = "http://localhost:3000/index";

  const handleAddFatura = (e) => {
    e.preventDefault();
    console.log("funcionei?");

    const faturaData = {
      creditor: creditor,
      amount: amount,
      months: months,
    };

    console.log(creditor, amount, months);

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(faturaData),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("deu merda");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className="entry-card" onSubmit={onSubmit}>
      <div className="section-heading">
        <span className="section-tag">Nova fatura</span>
        <h2>Adicionar cobranca</h2>
      </div>

      <label className="field">
        <span>Nome de quem voce deve</span>
        <input
          type="text"
          value={creditor}
          onChange={onCreditorChange}
          placeholder="Ex.: Ana Ferreira"
        />
      </label>

      <label className="field">
        <span>Valor total da fatura</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={onAmountChange}
          placeholder="0,00"
        />
      </label>

      <label className="field">
        <span>Quantos meses para pagar</span>
        <input
          type="number"
          min="1"
          step="1"
          value={months}
          onChange={onMonthsChange}
          placeholder="1"
        />
      </label>

      <div className="helper-copy">
        <p>
          Preview do valor salvo: {formatCurrencyFromCents(draftAmountInCents)}
        </p>
        <p>
          O sistema guarda o valor total da fatura, sem dividir em parcelas.
        </p>
      </div>

      <button
        className="primary-button"
        type="submit"
        onClick={handleAddFatura}
      >
        Adicionar fatura
      </button>
    </form>
  );
}

export default InvoiceForm;
