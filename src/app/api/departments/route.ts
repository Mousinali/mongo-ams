import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";

export async function GET() {
  try {
    await connectDB();

    const departments =
      await Department.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
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

    const department =
      await Department.create(
        body
      );

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create department",
      },
      {
        status: 500,
      }
    );
  }
}