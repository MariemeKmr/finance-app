import mongoose from "mongoose";

const RecurringChargeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Charges fixes", "Alimentation", "Transport", "Santé", "Loisirs", "Autres"],
    default: "Charges fixes"
  },
  description: { type: String },
  dayOfMonth: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.RecurringCharge || mongoose.model("RecurringCharge", RecurringChargeSchema);