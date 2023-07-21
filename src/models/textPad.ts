import mongoose from "mongoose";

const textPadSchema = new mongoose.Schema({
  text: {
    type: String,
  },
});

const Text = mongoose.model("Text", textPadSchema, "text");

export default Text;
