import mongoose from "mongoose";

const AssignmentSchema =
  new mongoose.Schema(
    {
      asset: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Asset",

        required: true,
      },

      employee: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Employee",

        required: true,
      },

      assignedDate: {
        type: Date,

        default: Date.now,
      },

      expectedReturnDate: {
        type: Date,
      },

      returnedDate: {
        type: Date,
      },

      assignmentReason: {
        type: String,
      },

      returnReason: {
        type: String,
      },

      notes: {
        type: String,
      },

      status: {
        type: String,

        enum: [
          "Assigned",
          "Returned",
          "Lost",
          "Damaged",
        ],

        default: "Assigned",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Assignment ||
  mongoose.model(
    "Assignment",
    AssignmentSchema
  );