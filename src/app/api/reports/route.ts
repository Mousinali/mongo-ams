export const dynamic =
  "force-dynamic";

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Assignment from "@/models/Assignment";

/* IMPORTANT */
import "@/models/Employee";
import "@/models/Department";
import "@/models/Designation";
import "@/models/Asset";
import "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const reports =
      await Assignment.find()
        .populate({
          path: "employee",

          populate: [
            {
              path: "department",
            },

            {
              path: "designation",
            },
          ],
        })

        .populate({
          path: "asset",

          populate: {
            path: "category",
          },
        })

        .sort({
          createdAt: -1,
        })

        .lean();

    return NextResponse.json({
      success: true,

      data: reports,
    });
  } catch (error) {
    console.log(
      "REPORT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch reports",
      },

      {
        status: 500,
      }
    );
  }
}