import mongoose from "mongoose";

const CategorySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },

      status: {
        type: String,

        enum: [
          "Active",
          "Inactive",
        ],

        default: "Active",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Category ||
  mongoose.model(
    "Category",
    CategorySchema
  );