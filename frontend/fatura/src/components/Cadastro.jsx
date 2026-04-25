import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();
  const [errorData, setErrorData] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cadastroData = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      email: formData.email,
      senha: formData.senha,
    };

    const res = await fetch("http://localhost:3000/cadastro", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cadastroData),
    });

    const data = await res.json();

    console.log(data);

    if (res.status === 500) {
      setErrorData(data.message);
    }

    if (res.status === 201) {
      navigate("/");
    }

    // localStorage.setItem("cadastroUsuario", JSON.stringify(cadastroData));
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <aside className="auth-hero">
          <div className="auth-brand">
            <span className="section-tag">Nova conta</span>
            <h1>
              Crie seu acesso e organize suas faturas desde o primeiro dia.
            </h1>
            <p>
              Cadastre seus dados, monte sua base de contas e acompanhe a
              evolucao dos pagamentos em um unico lugar.
            </p>
          </div>

          <ul className="auth-highlights">
            <li>
              <strong>Cadastro rapido</strong>
              Em poucos campos voce ja entra no fluxo principal do sistema.
            </li>
            <li>
              <strong>Navegacao pronta</strong>A rota `/cadastro` fica
              disponivel para acesso direto.
            </li>
          </ul>
        </aside>

        <div className="auth-form-panel">
          <div className="auth-heading">
            <Link className="auth-back-link" to="/">
              Voltar para login
            </Link>
            <h2>Criar cadastro</h2>
            <p>Preencha seus dados para liberar o acesso ao painel.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-row">
              <label className="field">
                <span>Nome</span>
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Sobrenome</span>
                <input
                  type="text"
                  name="sobrenome"
                  placeholder="Seu sobrenome"
                  value={formData.sobrenome}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>E-mail</span>
              <input
                type="email"
                name="email"
                placeholder="voce@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Senha</span>
              <input
                type="password"
                name="senha"
                placeholder="Crie uma senha segura"
                minLength="6"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </label>

            <button className="primary-button auth-submit" type="submit">
              Finalizar cadastro
            </button>
          </form>

          {errorData && <p className="error">{errorData}</p>}

          <p className="auth-footer">
            Ja possui conta? <Link to="/">Entrar agora</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;
