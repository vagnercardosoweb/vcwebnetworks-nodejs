import Jwt from '../lib/Jwt';

export default logged => async (req, res, next) => {
  const row = {};
  const method = req.method.toLowerCase();

  let decoded = {};
  let status = 403;

  if (['options'].includes(method)) {
    return next();
  }

  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new Error('Acesso negado.');
    }

    const [, token] = header.split(' ');

    try {
      decoded = await Jwt.decode(token.trim());
    } catch (err) {}

    if (!decoded.id && process.env.API_KEY !== token && logged === false) {
      throw new Error(
        'Acesso negado! Não foi possível validar sua requisição.'
      );
    }

    // Caso tenha que está logado e não exista o id
    if (logged === true) {
      status = 401;

      if (!decoded.id) {
        throw new Error('Acesso não autorizado! Favor realize o login.');
      }

      // VALIDATE USER LOGIN
      // TODO
      // row = {};

      if (!row || row === undefined) {
        throw new Error(
          `Acesso não autorizado! Registro #${decoded.id} não encontrado.`
        );
      }

      delete decoded.id;
      delete decoded.iat;
    }

    req.auth = {
      ...decoded,
      ...row,
    };

    next();
  } catch (err) {
    return res.error(err, status);
  }
};
