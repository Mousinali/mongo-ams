export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Asset from "@/models/Asset";

/* IMPORTANT */
import "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const assets = await Asset.find()
      .populate("category")
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.log("ASSET API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch assets",
      },
      {
        status: 500,
      },
    );
  }
}

/* CREATE ASSET */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const asset = await Asset.create({
      assetId: body.assetId,

      name: body.name,

      category: body.category,

      brand: body.brand,

      model: body.model,

      serialNumber: body.serialNumber,

      purchaseDate: body.purchaseDate,

      warrantyExpiry: body.warrantyExpiry,

      status: body.status,

      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    console.log("CREATE ASSET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create asset",
      },
      {
        status: 500,
      },
    );
  }
}
