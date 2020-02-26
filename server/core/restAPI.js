const resStatus200 = (dataRes = null) => {
  return {status: 200, data: dataRes}
}
const resStatus500 = (messageRes = "Internal Server Error") => {
  return {
    "status": 500,
    "message": messageRes
  };
}

module.exports = { resStatus200, resStatus500 }