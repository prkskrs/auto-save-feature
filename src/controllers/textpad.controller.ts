import Text from "../models/textPad";
import bigPromise from "../middlewares/bigPromise";
import dotenv from "dotenv";
dotenv.config();

export const getText = bigPromise(async (req, res, next) => {
  const notepad = await Text.findOne();
  if (notepad) {
    res.json({ text: notepad.text });
  } else {
    res.json({ text: "" });
  }
});

export const saveText = bigPromise(async (req, res, next) => {
  const { text } = req.body;
  const myNote = await Text.findOne();
  if (myNote) {
    myNote.text = text;
    await myNote.save();
  } else {
    await Text.create({ text });
  }
  res.json({ success: true });
});


