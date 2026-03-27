import dbConnect from '@/lib/db';
import Users from '@/models/Users';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "all";

    let query = {};
    if (location !== "all") {
      query.location = { $regex: new RegExp(location, "i") };
    }

    // Fetch all matching users without pagination
    const users = await Users.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}