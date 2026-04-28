import { useState } from "react";

function InvoiceForm({
  creditor,
  amount,
  months,
  draftAmountInCents,
  onCreditorChange,
  onAmountChange,
  onMonthsChange,
  formatCurrencyFromCents,
  token,
  handleInvoice,
}) {
  const url = "http://localhost:3000/index";

  const [errorData, setErrorData] = useState("");

  const handleAddFatura = async (e) => {
    e.preventDefault();

    if (creditor === "" || amount === "" || months === "") {
      const error = new Error("Preencha todos os campos");
      setErrorData(error.message);
      throw error;
    }

    setErrorData("");

    const faturaData = {
      creditor: creditor,
      amount: amount,
      months: months,
    };

    try {
      const res = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(faturaData),
      });
      if (!res.ok) {
        throw new Error("Não foi possível registrar a fatura");
      }
      const data = await res.json();
      handleInvoice({
        id: data.fatura._id ?? data.fatura.id,
        creditor: data.fatura.creditor ?? creditor.trim(),
        amount: Number(data.fatura.amount ?? amount),
        months: Number(data.fatura.months ?? months),
      });
    } catch (err) {
      setErrorData(err.message);
    }
  };

  return (
    <form className="entry-card" onSubmit={handleAddFatura}>
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
          required
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
          required
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
          required
        />
      </label>

      {errorData && <p className="error">{errorData}</p>}

      <div className="helper-copy">
        <p>
          Preview do valor salvo: {formatCurrencyFromCents(draftAmountInCents)}
        </p>
        <p>
          O sistema guarda o valor total da fatura, sem dividir em parcelas.
        </p>
      </div>

      <button className="primary-button" type="submit">
        Adicionar fatura
      </button>
    </form>
  );
}

export default InvoiceForm;
