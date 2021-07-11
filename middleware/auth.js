const jwtService = require('./jwt-service');

const getRequestToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.split(' ')[1])
    || req.query.token
    || req.body.token;
  return token;
}

const responseError = (res, error) => {
  const status = (error && error.status) || 400;
  const msg = typeof error === "string" ? error : (error.title || error.message);
  return res.status(status).send({ title: msg });
};

const responseBadRequest = (res) => {
  return responseError(res, { status: 400, title: 'Bad request' });
};

const responseNotAuthorized = (res) => {
  // return res.status(ERROR_TEMPLATE_DATA.TOKEN_NOT_FOUND.status).send(ERROR_TEMPLATE_DATA.TOKEN_NOT_FOUND.data);
  // return responseError(res, { status: 401, title: 'Not authorized' });
  res.status(400).send({ title: 'Not authorized' });
};

const responseNoPernission = (res) => {
  return responseError(res, { status: 403, title: 'No Permission' });
};

const responseMissingArguments = (res) => {
  return responseError(res, { status: 400, title: 'Missing arguments' });
};

const authorizeJWTToken = async (req, res, next) => {
  const token = getRequestToken(req);
  if (!token) return responseNotAuthorized(res);

  try {
    jwtService.verifyToken(token).then( (decoded, err) => {
      if (decoded && decoded.data && decoded.data._id) {
        req.user = { ...decoded.data };
        return next();
      }

      return responseError(res,{ status: 401, message: 'Not authorized' });

    })

  } catch(e) {
    return responseError(res, e);
  }
  
}

const isAdmin = async (req, res, next) => {
  const { role } = req.user
  
  if(!role) return responseNotAuthorized(res);
  if(role !== 'admin') return responseNotAuthorized(res);
  return next();
  
}

module.exports = {
  getRequestToken,

  authorizeJWTToken,
  isAdmin,
  responseError,
  responseBadRequest,
  responseNotAuthorized,
  responseNoPernission,
  responseMissingArguments
};
