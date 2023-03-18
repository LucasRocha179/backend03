const router = require("express").Router();
const usuario = require("../controller/usuario.controller");

router.get("/find/:id", usuario.find);
router.get("/findAll", usuario.findAll);
router.post("/create", usuario.create);
router.post("/update/:id", usuario.update);
router.post("/delete/:id", usuario.deleteUser);

module.exports = router;