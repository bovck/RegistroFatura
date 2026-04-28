import { useState } from "react";
import InvoiceForm from "./InvoiceForm";
import InvoiceList from "./InvoiceList";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const initialInvoices = [
  {
    id: "fatura-1",
    creditor: "Ana Ferreira",
    totalAmountInCents: 248000,
    months: 6,
    payoffLabel: "Setembro 2026",
  },
];

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

function InvoiceDashboard({ token }) {
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("1");
  const [invoices, setInvoices] = useState(initialInvoices);

  const handleInvoice = (creditor, amount, month) => {
    console.log(creditor, amount, month);
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

  function handleSubmit(event) {
    event.preventDefault();

    const cleanCreditor = creditor.trim();
    if (!cleanCreditor || draftAmountInCents <= 0) {
      return;
    }

    const newInvoice = {
      id: `fatura-${Date.now()}`,
      creditor: cleanCreditor,
      totalAmountInCents: draftAmountInCents,
      months: parsedMonths,
      payoffLabel: formatMonthLabel(parsedMonths),
    };

    setInvoices((currentInvoices) => [newInvoice, ...currentInvoices]);
    setCreditor("");
    setAmount("");
    setMonths("1");
  }

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
          onSubmit={handleSubmit}
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
          token={token}
        />
      </section>
    </main>
  );
}

export default InvoiceDashboard;
