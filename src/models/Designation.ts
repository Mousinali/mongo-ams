import mongoose from "mongoose";

const DesignationSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      department: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Department",

        required: true,
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
  .Designation ||
  mongoose.model(
    "Designation",
    DesignationSchema
  );