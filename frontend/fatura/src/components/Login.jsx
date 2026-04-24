import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/faturas')
  }

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
              <input type="email" placeholder="voce@exemplo.com" required />
            </label>

            <label className="field">
              <span>Senha</span>
              <input type="password" placeholder="Digite sua senha" required />
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
  )
}

export default Login
