import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Designation from "@/models/Designation";

export async function GET() {
  try {
    await connectDB();

    const designations =
      await Designation.find()
        .populate("department")
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      data: designations,
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

    const designation =
      await Designation.create(
        body
      );

    return NextResponse.json({
      success: true,
      data: designation,
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