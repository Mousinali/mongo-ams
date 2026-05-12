export const dynamic =
  "force-dynamic";

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Asset from "@/models/Asset";

import Employee from "@/models/Employee";

import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    await connectDB();

    /* Counts */
    const totalAssets =
      await Asset.countDocuments();

    const totalEmployees =
      await Employee.countDocuments();

    const availableAssets =
      await Asset.countDocuments({
        status: "Available",
      });

    const assignedAssets =
      await Asset.countDocuments({
        status: "Assigned",
      });

    /* Recent Assets */
    const recentAssets =
      await Asset.find()
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    /* Latest Assignments */
    const latestAssignments =
      await Assignment.find()
        .populate("employee")
        .populate("asset")
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    return NextResponse.json({
      success: true,

      stats: {
        totalAssets,

        totalEmployees,

        availableAssets,

        assignedAssets,
      },

      recentAssets,

      latestAssignments,
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