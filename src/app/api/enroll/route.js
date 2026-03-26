import dbConnect from '@/lib/db';
import Users from '@/models/Users';
import { NextResponse } from 'next/server';
import { sendEnrollmentEmail } from '@/lib/sendEmail'; 

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, username, course,coursePrice,discountPrice, finalPrice, modeOfLearning } = data; 
    console.log(email, username, course,coursePrice,discountPrice, finalPrice, modeOfLearning)

    // 1. IMPROVED: Case-insensitive email check
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