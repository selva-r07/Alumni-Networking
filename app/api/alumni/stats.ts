import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/model/Job";

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const alumniId = url.pathname.split('/')[3];

    const jobsPosted = await Job.find({ postedBy: alumniId });
    
    const totalApplications = jobsPosted.reduce(
      (sum, job) => sum + (job.registrations?.length || 0),
      0
    );

    return NextResponse.json({
      totalApplications,
      totalProfileViews: 0,
    });
  } catch (error) {
    console.error("GET ALUMNI STATS ERROR:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
