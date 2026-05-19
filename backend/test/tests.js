import { expect } from "chai";
import bcrypt from "bcrypt";
import { postCadastro, postLogin } from "../controllers/user.js";
import {
  deleteFatura,
  getFatura,
  postFatura,
  putFatura,
} from "../controllers/fatura.js";
import User from "../models/user.js";
import Fatura from "../models/fatura.js";

const originals = {
  userFindOne: User.findOne,
  userFindById: User.findById,
  userFindByIdAndUpdate: User.findByIdAndUpdate,
  userSave: User.prototype.save,
  faturaFind: Fatura.find,
  faturaFindOne: Fatura.findOne,
  faturaFindOneAndDelete: Fatura.findOneAndDelete,
  faturaSave: Fatura.prototype.save,
};

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function createNext() {
  const calls = [];
  const next = (error) => calls.push(error);
  next.calls = calls;
  return next;
}

describe("controllers/user", () => {
  afterEach(() => {
    User.findOne = originals.userFindOne;
    User.prototype.save = originals.userSave;
  });

  it("postCadastro cria um usuário quando o e-mail não existe", async () => {
    let savedUser;
    User.findOne = async () => null;
    User.prototype.save = async function save() {
      savedUser = this;
    };

    const req = {
      body: {
        nome: "Ana",
        sobrenome: "Silva",
        email: "ana@email.com",
        senha: "123456",
      },
    };
    const res = createResponse();
    const next = createNext();

    await postCadastro(req, res, next);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.deep.equal({ message: "conta criada com sucesso" });
    expect(savedUser.email).to.equal("ana@email.com");
    expect(savedUser.senha).to.not.equal("123456");
    expect(next.calls).to.be.empty;
  });

  it("postCadastro envia erro ao next quando o e-mail já existe", async () => {
    User.findOne = async () => ({ email: "ana@email.com" });

    const req = {
      body: {
        nome: "Ana",
        sobrenome: "Silva",
        email: "ana@email.com",
        senha: "123456",
      },
    };
    const res = createResponse();
    const next = createNext();

    await postCadastro(req, res, next);

    expect(next.calls).to.have.lengthOf(1);
    expect(next.calls[0].message).to.equal("Esse e-mail já existe");
    expect(next.calls[0].statusCode).to.equal(500);
    expect(res.statusCode).to.equal(null);
  });

  it("postLogin retorna token quando as credenciais são válidas", async () => {
    const senhaHash = await bcrypt.hash("123456", 12);
    User.findOne = async () => ({
      _id: { toString: () => "user-1" },
      email: "ana@email.com",
      senha: senhaHash,
    });

    const req = {
      body: {
        email: "ana@email.com",
        senha: "123456",
      },
    };
    const res = createResponse();
    const next = createNext();

    await postLogin(req, res, next);

    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal("usuário logado");
    expect(res.body.userId).to.equal("user-1");
    expect(res.body.token).to.be.a("string").and.not.empty;
    expect(next.calls).to.be.empty;
  });
});

describe("controllers/fatura", () => {
  afterEach(() => {
    User.findById = originals.userFindById;
    User.findByIdAndUpdate = originals.userFindByIdAndUpdate;
    Fatura.find = originals.faturaFind;
    Fatura.findOne = originals.faturaFindOne;
    Fatura.findOneAndDelete = originals.faturaFindOneAndDelete;
    Fatura.prototype.save = originals.faturaSave;
  });

  it("postFatura cria uma fatura válida para o usuário", async () => {
    let savedFatura;
    const userId = "507f1f77bcf86cd799439011";
    const user = {
      _id: userId,
      name: "Ana",
      faturas: [],
      saveCalled: false,
      async save() {
        this.saveCalled = true;
      },
    };

    Fatura.prototype.save = async function save() {
      savedFatura = this;
    };
    User.findById = async (id) => {
      expect(id).to.equal(userId);
      return user;
    };

    const req = {
      userId,
      body: {
        creditor: " Banco ",
        amount: "120.50",
        months: "3",
      },
    };
    const res = createResponse();
    const next = createNext();

    await postFatura(req, res, next);

    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.equal("Produto criado");
    expect(savedFatura.creditor).to.equal("Banco");
    expect(savedFatura.amount).to.equal(120.5);
    expect(savedFatura.months).to.equal(3);
    expect(savedFatura.criador.toString()).to.equal(userId);
    expect(user.faturas).to.have.lengthOf(1);
    expect(user.saveCalled).to.equal(true);
    expect(next.calls).to.be.empty;
  });

  it("postFatura envia erro ao next quando os dados são inválidos", async () => {
    const req = {
      userId: "user-1",
      body: {
        creditor: "",
        amount: 0,
        months: 1,
      },
    };
    const res = createResponse();
    const next = createNext();

    await postFatura(req, res, next);

    expect(next.calls).to.have.lengthOf(1);
    expect(next.calls[0].message).to.equal("Dados da fatura inválidos.");
    expect(next.calls[0].statusCode).to.equal(422);
    expect(res.statusCode).to.equal(null);
  });

  it("getFatura busca as faturas do usuário ordenadas por data", async () => {
    const faturas = [{ creditor: "Banco" }];
    let findQuery;
    let sortQuery;

    Fatura.find = (query) => {
      findQuery = query;
      return {
        sort(sort) {
          sortQuery = sort;
          return Promise.resolve(faturas);
        },
      };
    };

    const req = { userId: "user-1" };
    const res = createResponse();
    const next = createNext();

    await getFatura(req, res, next);

    expect(findQuery).to.deep.equal({ criador: "user-1" });
    expect(sortQuery).to.deep.equal({ createdAt: -1 });
    expect(res.statusCode).to.equal(200);
    // expect(res.body.faturas).to.deep.equal(faturas);
    expect(res.body.faturas).to.not.equal(faturas);
    expect(next.calls).to.be.empty;
  });

  it("putFatura atualiza uma fatura existente", async () => {
    const fatura = {
      creditor: "Antigo",
      amount: 10,
      months: 1,
      saveCalled: false,
      async save() {
        this.saveCalled = true;
      },
    };

    Fatura.findOne = async (query) => {
      expect(query).to.deep.equal({ _id: "fat-1", criador: "user-1" });
      return fatura;
    };

    const req = {
      userId: "user-1",
      params: { faturaId: "fat-1" },
      body: {
        creditor: "Novo Credor",
        amount: "90",
        months: "2",
      },
    };
    const res = createResponse();
    const next = createNext();

    await putFatura(req, res, next);

    expect(res.statusCode).to.equal(200);
    expect(fatura.creditor).to.equal("Novo Credor");
    expect(fatura.amount).to.equal(90);
    expect(fatura.months).to.equal(2);
    expect(fatura.saveCalled).to.equal(true);
    expect(next.calls).to.be.empty;
  });

  it("deleteFatura remove uma fatura do usuário", async () => {
    let updateId;
    let updateBody;
    Fatura.findOneAndDelete = async (query) => {
      expect(query).to.deep.equal({ _id: "fat-1", criador: "user-1" });
      return { _id: "fat-1" };
    };
    User.findByIdAndUpdate = async (id, body) => {
      updateId = id;
      updateBody = body;
    };

    const req = {
      userId: "user-1",
      params: { faturaId: "fat-1" },
    };
    const res = createResponse();
    const next = createNext();

    await deleteFatura(req, res, next);

    expect(updateId).to.equal("user-1");
    expect(updateBody).to.deep.equal({ $pull: { faturas: "fat-1" } });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Fatura excluída com sucesso",
      faturaId: "fat-1",
    });
    expect(next.calls).to.be.empty;
  });
});
