import { HttpStatus } from '../modules/http-status'

interface Response  {
    response: any;
    message?: string;
    warning?: any,
    meta?: any
};

interface ErrorResponse  {
    err: any;
    message?: string;
};

export default (err, response, extra) => {
  let result: Response = {response};
  const {message = '', res, warning, meta} = extra;
  let {headerStatus} = extra;
  if (message !== '') {
    result = {...result, message};
  }
  if(warning){
    result = {...result, warning};
  }
  if(meta){
    result = {...result, meta};
  }
  if (!err && !(headerStatus >= 400)) {
    res.send(HttpStatus.OK, result);
  } else {
    let errorResponse: ErrorResponse;
    errorResponse = {
        err:
            err != null
            ? (err.stack !== undefined ? err.stack.split('\n') : err) || err
            : 'Solvable Error'
    };
    if (message !== '') {
      errorResponse = {...errorResponse, message};
    } else {
      errorResponse.message = HttpStatus.BAD_REQUEST ? 'Check your request please' : 'Something went wrong';
    }
    if (!headerStatus) {
      headerStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    res.send(headerStatus, errorResponse);
  }
};
