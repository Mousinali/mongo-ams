import mongoose from "mongoose";

const EmployeeSchema =
  new mongoose.Schema(
    {
      employeeId: {
        type: String,
        required: true,
        unique: true,
      },

      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
      },

      phone: {
        type: String,
      },

      department: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Department",

        required: true,
      },

      designation: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Designation",

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
  .Employee ||
  mongoose.model(
    "Employee",
    EmployeeSchema
  );