import nodemailer from 'nodemailer';

export async function sendEnrollmentEmail(userEmail, firstName, courseName, coursePrice, discountPrice, finalPrice) {



  try {


    const transporter = nodemailer.createTransport({

      service: 'gmail', // Or your preferred provider
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"Loctech Easter Egg Discoout" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "You tapped an egg, now you can save big!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://www.loctechng.com/_next/image?url=%2Fimages%2Flogo.png&w=3840&q=75" alt="Logo" style="width: 150px;" />
        </div>
        <h2 style="color: #333;">Congratulations, ${firstName}!</h2>
        <h3 style="color:#333;">Happy Easter!</h3>

        <p style="font-size: 16px; color: #333; line-height: 2;">
        Your Easter luck is here. You tapped an egg, and you have received a <span style="font-weight:600 ; font-size:18px">₦${discountPrice.toLocaleString()}%</span> discount for the course ${courseName}.
        </p>

        <div style="background-color: #f9f9f9; padding: 15px; font-size:16px; border-radius: 10px; margin: 20px 0; line-height: 2;">
          <p style="margin: 0;">This means you can register for your prefered <strong>Course: ${courseName} </strong> for <span class="font-size:18.5px; color:black; font-weight:500 ">₦${finalPrice.toLocaleString()}</p>

          <p style="margin: 5px 0 0 0;"> Which is less than the original price <del class=" text-decoration-line: line-through; color:#f9f9f9"> ₦${coursePrice.toLocaleString()}</del></p>
        </div>

        <p style="font-size: 16px; color: #333; line-height: 2;">
          Please note that this discount is valid until 18th April 2026. After this date, the discount will expire.  Take advantage of this opportunity and begin your tech journey with us.
        </p>
        
       


        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
         Best regards,
        Loctech IT Training Institute
        </p>
      </div>
    `,
    };


    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent:", info.response);


  } catch (error) {
    console.error(" Error sending email:", error);
  }
}

