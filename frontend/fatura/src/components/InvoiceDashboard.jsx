import { useEffect, useState } from "react";
import InvoiceForm from "./InvoiceForm";
import InvoiceList from "./InvoiceList";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const initialInvoices = [];
const url = "http://localhost:3000/index";

function formatCurrencyFromCents(valueInCents) {
  return currencyFormatter.format(valueInCents / 100);
}

function getInstallmentAmountInCents(totalAmountInCents, months) {
  return Math.round(totalAmountInCents / Math.max(months, 1));
}

function formatMonthLabel(monthsAhead) {
  const baseDate = new Date();
  const targetDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + Math.max(monthsAhead - 1, 0),
    1,
  );
  const label = targetDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildInvoiceItem(invoiceData) {
  const parsedAmount = Number(invoiceData.amount);
  const safeAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
  const parsedMonths = Math.max(
    1,
    Number(invoiceData.months ?? invoiceData.month) || 1,
  );
  const rawId = invoiceData.id ?? invoiceData._id;
  const normalizedId = rawId
    ? String(rawId).startsWith("fatura-")
      ? String(rawId)
      : `fatura-${rawId}`
    : `fatura-${Date.now()}`;

  return {
    id: normalizedId,
    creditor: invoiceData.creditor?.trim() ?? "",
    totalAmountInCents: Math.max(0, Math.round(safeAmount * 100)),
    months: parsedMonths,
    payoffLabel: formatMonthLabel(parsedMonths),
  };
}

function InvoiceDashboard({ token }) {
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("1");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [requestError, setRequestError] = useState("");

  const handleInvoice = (invoiceData) => {
    const newInvoice = buildInvoiceItem(invoiceData);

    setInvoices((currentInvoices) => [newInvoice, ...currentInvoices]);
    setRequestError("");
    setCreditor("");
    setAmount("");
    setMonths("1");
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Não foi possível carregar as faturas.");
        }

        return res.json();
      })
      .then((data) => {
        setInvoices((data.faturas ?? []).map(buildInvoiceItem));
        setRequestError("");
      })
      .catch((error) => {
        setRequestError(error.message);
      });
  }, [token]);

  const handleUpdateInvoice = async (invoiceData) => {
    const rawId = String(invoiceData.id).replace(/^fatura-/, "");
    const res = await fetch(`${url}/${rawId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        creditor: invoiceData.creditor,
        amount: invoiceData.amount,
        months: invoiceData.months,
      }),
    });

    if (!res.ok) {
      throw new Error("Não foi possível atualizar a fatura.");
    }

    const data = await res.json();
    const updatedInvoice = buildInvoiceItem(data.fatura);

    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
      ),
    );
    setRequestError("");
  };

  const handleDeleteInvoice = async (invoiceId) => {
    const rawId = String(invoiceId).replace(/^fatura-/, "");
    const res = await fetch(`${url}/${rawId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      throw new Error("Não foi possível excluir a fatura.");
    }

    setInvoices((currentInvoices) =>
      currentInvoices.filter((invoice) => invoice.id !== invoiceId),
    );
    setRequestError("");
  };

  const parsedAmount = Number(amount);
  const parsedMonths = Math.max(1, Number(months) || 1);
  const draftAmountInCents = Number.isFinite(parsedAmount)
    ? Math.max(0, Math.round(parsedAmount * 100))
    : 0;

  const totalOpenInCents = invoices.reduce(
    (sum, invoice) => sum + invoice.totalAmountInCents,
    0,
  );
  const draftPayoffLabel = formatMonthLabel(parsedMonths);

  return (
    <main className="app-shell">
      <section className="dashboard">
        <InvoiceForm
          creditor={creditor}
          amount={amount}
          months={months}
          draftAmountInCents={draftAmountInCents}
          onCreditorChange={(event) => setCreditor(event.target.value)}
          onAmountChange={(event) => setAmount(event.target.value)}
          onMonthsChange={(event) => setMonths(event.target.value)}
          formatCurrencyFromCents={formatCurrencyFromCents}
          token={token}
          handleInvoice={handleInvoice}
        />

        <InvoiceList
          invoices={invoices}
          totalOpenInCents={totalOpenInCents}
          draftAmountInCents={draftAmountInCents}
          parsedMonths={parsedMonths}
          draftPayoffLabel={draftPayoffLabel}
          formatCurrencyFromCents={formatCurrencyFromCents}
          getInstallmentAmountInCents={getInstallmentAmountInCents}
          onUpdateInvoice={handleUpdateInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          requestError={requestError}
        />
      </section>
    </main>
  );
}

export default InvoiceDashboard;
