import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dof: {
    type: Date,
    required: true
  },
  memberid: {
    type: Number,
    required: true
  },
  interests: {
    type: String,
  }
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
