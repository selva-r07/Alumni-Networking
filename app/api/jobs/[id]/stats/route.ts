// app/api/alumni/[id]/stats/route.ts
//
// GET — returns live stats for an alumni:
//   - totalJobs:         how many jobs they've posted
//   - totalApplications: total registrations across all their jobs
//   - totalProfileViews: how many times students viewed their profile
//
// Used by AlumniDashboard to show real numbers in the stats cards.

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/model/Job";
import User from "@/model/User";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // All jobs posted by this alumni
    const jobs = await Job.find({ postedBy: params.id });

    const totalJobs = jobs.length;

    // Sum all registrations arrays across all jobs
    const totalApplications = jobs.reduce(
      (sum, job) => sum + (job.registrations?.length ?? 0),
      0
    );

    // Profile views from User model
    const alumni = await User.findOne({ _id: params.id, role: "alumni" }).select("profileViews");
    const totalProfileViews = alumni?.profileViews?.length ?? 0;

    return Response.json(
      { totalJobs, totalApplications, totalProfileViews },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ GET alumni stats error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}