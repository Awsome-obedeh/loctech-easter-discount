import dbConnect from '@/lib/db';
import Users from '@/models/Users';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();


    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const location = searchParams.get("location") || "all";

    
    let query = {};
    if (location !== "all") {
      // Use regex 'i' for case-insensitive matching
      query.location = { $regex: new RegExp(location, "i") };
    }

    // 3. Execute Pagination logic
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      Users.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Users.countDocuments(query)
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + users.length < total
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}