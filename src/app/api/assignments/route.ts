import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Assignment from "@/models/Assignment";

import Asset from "@/models/Asset";
import Employee from "@/models/Employee";
import Department from "@/models/Department";
import Designation from "@/models/Designation";

export async function GET() {
  try {
    await connectDB();

    const assignments =
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
        .populate("asset")
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const assignment =
      await Assignment.create(
        body
      );

    await Asset.findByIdAndUpdate(
      body.asset,
      {
        status: "Assigned",
      }
    );

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}