import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Assignment from "@/models/Assignment";

import Asset from "@/models/Asset";

export async function PUT(
  req: Request,
  { params }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await params;

    const body =
      await req.json();

    /* Update assignment */
    const assignment =
      await Assignment.findByIdAndUpdate(
        id,
        {
          status: "Returned",

          returnReason:
            body.returnReason,

          notes: body.notes,

          returnedDate:
            new Date(),
        },
        {
          new: true,
        }
      );

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Assignment not found",
        },
        {
          status: 404,
        }
      );
    }

    /* Make asset available again */
    await Asset.findByIdAndUpdate(
      assignment.asset,
      {
        status: "Available",
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(
      "RETURN ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to return asset",
      },
      {
        status: 500,
      }
    );
  }
}