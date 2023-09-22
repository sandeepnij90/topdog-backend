import { Schema, model } from "mongoose";

const NotesSchema = new Schema({
  _id: Schema.Types.ObjectId,
  note: { type: String, required: true },
  date: { type: Date, required: false },
});

const DogSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  notes: { type: [NotesSchema], required: false, default: [] },
});

const ClientSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dogs: { type: [DogSchema], default: [] },
});

const clientModel = model("Client", ClientSchema);

export default clientModel;
