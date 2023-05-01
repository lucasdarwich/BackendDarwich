import registroModel from "../models/registro.model.js";

export const modifyUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    //Verificamos si el usuario existe en la db
    const user = await registroModel.find({ _id: userId });
    //obtenemos el actual rol del usuario
    const userRole = user.rol;
    //validamos el rol actual y cambiamos el rol del usuario
    if (userRole === "usuario") {
      user.rol = PremiumRole;
    } else if (userRole === PremiumRole) {
      user.rol = "usuario";
    } else {
      return res.json({
        status: "error",
        message: "No es posible cambiar el rol de un administrador",
      });
    }
    await registroModel.findByIdAndUpdate(userId, user);
    res.json({
      status: "success",
      message: `nuevo rol del usuario: ${user.rol}`,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
