import { Schema, model } from "mongoose";

const requiredString = {
  type: String,
  required: true,
};

const schema = new Schema({
  account: {
    ...requiredString,
    unique: true,
    index: true,
  },
  profileId: requiredString,
  signature: requiredString,
  name: requiredString,
  surname: requiredString,
  address: requiredString,
});

export const User = model("User", schema);
