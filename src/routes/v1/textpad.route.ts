import express from "express";
const router = express.Router();

// import controllers
import { getText, saveText } from "../../controllers/textpad.controller";

router.route("/").get(getText);
router.route("/").patch(saveText);

export default router;
