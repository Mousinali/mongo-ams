export const dynamic =
  "force-dynamic";

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Admin from "@/models/Admin";

/* GET SETTINGS */
export async function GET() {
  try {
    await connectDB();

    const admin =
      await Admin.findOne().lean();

    return NextResponse.json({
      success: true,

      data: admin,
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

/* UPDATE SETTINGS */
export async function PUT(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const admin =
      await Admin.findOne();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Admin not found",
        },

        {
          status: 404,
        }
      );
    }

    admin.email =
      body.email;

    admin.password =
      body.password;

    await admin.save();

    return NextResponse.json({
      success: true,
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