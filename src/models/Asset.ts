import mongoose from "mongoose";

const AssetSchema =
  new mongoose.Schema(
    {
      assetId: {
        type: String,
        required: true,
        unique: true,
      },

      name: {
        type: String,
        required: true,
      },

      category: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Category",

        required: true,
      },

      brand: {
        type: String,
      },

      model: {
        type: String,
      },

      serialNumber: {
        type: String,
      },

      purchaseDate: {
        type: Date,
      },

      warrantyExpiry: {
        type: Date,
      },

      notes: {
        type: String,
      },

      status: {
        type: String,

        enum: [
          "Available",
          "Assigned",
          "Repair",
          "Retired",
        ],

        default: "Available",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Asset ||
  mongoose.model(
    "Asset",
    AssetSchema
  );