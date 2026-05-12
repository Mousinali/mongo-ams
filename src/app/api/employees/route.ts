export const dynamic =
  "force-dynamic";

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Employee from "@/models/Employee";

/* IMPORTANT */
import "@/models/Department";
import "@/models/Designation";

export async function GET() {
  try {
    await connectDB();

    const employees =
      await Employee.find()
        .populate("department")
        .populate("designation")
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log(
      "EMPLOYEE API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to fetch employees",
      },
      {
        status: 500,
      }
    );
  }
}

/* CREATE EMPLOYEE */
export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const employee =
      await Employee.create({
        employeeId:
          body.employeeId,

        name: body.name,

        email: body.email,

        phone: body.phone,

        department:
          body.department,

        designation:
          body.designation,

        status: body.status,
      });

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.log(
      "CREATE EMPLOYEE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create employee",
      },
      {
        status: 500,
      }
    );
  }
}