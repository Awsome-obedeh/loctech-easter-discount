import dbConnect from '@/lib/db';
import Users from '@/models/Users';
import { NextResponse } from 'next/server';
import { sendEnrollmentEmail } from '@/lib/sendEmail'; 

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, username, course,coursePrice,discountPrice, finalPrice, modeOfLearning,location } = data; 
    // console.log(email, username, course,coursePrice,discountPrice, finalPrice, modeOfLearning)

  
    const isEmailExists = await Users.findOne({ 
      email:  email.toLowerCase() 
    });

    console.log(isEmailExists)

    if (isEmailExists) {
      return NextResponse.json(
        { message: "This email is already registered." }, 
        { status: 400 }
      );
    }

    const user = await Users.create(data);

    
    try {
        const firstName = username.split(" ")[0]; // Get only the first name
        await sendEnrollmentEmail(email, firstName, course, coursePrice, discountPrice, finalPrice);
    } catch (mailError) {
        console.error("Email failed to send:", mailError.message);
        
    }

    return NextResponse.json({ 
      message: "Student enrolled successfully", 
    }, { status: 201 });

  } catch (error) {
    console.error("Enrollment Error:", error.message);
    
    
    const status = error.name === 'ValidationError' ? 400 : 500;
    
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status }
    );
  }
}




export async function GET(req) {
  try {

    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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