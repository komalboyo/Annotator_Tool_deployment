// app/api/project/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Connect to the database
    await connectDB();

    // Get project ID from the URL params
    const { projectId } = await params;

    // Validate projectId format
    if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Find the project and populate admin and annotator details
    const project = await Project.findById(projectId)
    .populate({ path: 'adminId', model: User, select: 'username email' })
    .populate({ path: 'annotators', model: User, select: 'username email' });
  

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Return the project data
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
}
