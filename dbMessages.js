import mongoose from "mongoose";

const yourTalksSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

export default mongoose.model("messageConnect", yourTalksSchema);
