import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({ email: "", senha: "" });

  const navigate = useNavigate();

  function handleChange(e) {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch("http://localhost:3000/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    console.log(data);

    navigate("/faturas");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <aside className="auth-hero">
          <div className="auth-brand">
            <span className="section-tag">RegistroFatura</span>
            <h1>Entre para acompanhar suas faturas com mais clareza.</h1>
            <p>
              Centralize parcelas, acompanhe vencimentos e mantenha o controle
              financeiro em uma tela simples.
            </p>
          </div>

          <ul className="auth-highlights">
            <li>
              <strong>Resumo imediato</strong>
              Veja o total em aberto e o impacto das novas parcelas antes de
              salvar.
            </li>
            <li>
              <strong>Organizacao mensal</strong>
              Planeje os pagamentos e saiba ate quando cada compromisso vai.
            </li>
          </ul>
        </aside>

        <div className="auth-form-panel">
          <div className="auth-heading">
            <span className="section-tag">Login</span>
            <h2>Acessar conta</h2>
            <p>Use seu e-mail e senha para entrar no painel de faturas.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>E-mail</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="voce@exemplo.com"
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Senha</span>
              <input
                type="password"
                name="senha"
                onChange={handleChange}
                value={formData.senha}
                placeholder="Digite sua senha"
                required
              />
            </label>

            <button className="primary-button auth-submit" type="submit">
              Entrar
            </button>
          </form>

          <p className="auth-footer">
            Ainda nao tem conta? <Link to="/cadastro">Criar cadastro</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
