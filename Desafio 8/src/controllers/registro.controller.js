export const autentificarRegistro = async (req, res) => {
  res.send({ status: "success", message: "Usuario creado correctamente" });
};

export const falloRegistro = async (req, res) => {
  console.log("failed Strategy");
  res.send({ error: "Failed Strategy" });
};
