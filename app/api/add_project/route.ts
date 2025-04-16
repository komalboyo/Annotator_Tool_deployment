import { NextResponse } from "next/server";
import Project from "@/models/Project";
import Text from "@/models/Text";
import Annotation from "@/models/Annotation";
import { connectDB } from "@/lib/mongodb";
import Papa from "papaparse";

interface CsvRow {
    src_lang: string;
    src_txt: string;
    tgt_lang: string;
    tgt_text: string;
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();
        const file = formData.get("filename") as File;
        const name = formData.get("name")?.toString();
        const description = formData.get("description")?.toString();
        const adminId = formData.get("adminId")?.toString();
        const annotators = JSON.parse(formData.get("annotators")?.toString() || "[]");

        if (!file || !file.name.endsWith(".csv")) {
            return NextResponse.json({ error: "Invalid or missing CSV file" }, { status: 400 });
        }

        // Read the CSV content as a string (without using the filesystem)
        const csvText = await file.text();

        // Parse CSV to JSON using PapaParse
        const parsed = Papa.parse<CsvRow>(csvText, {
            header: true, // Use the first row as headers
            skipEmptyLines: true, // Skip empty lines
            dynamicTyping: true, // Convert types automatically (e.g., numbers)
        });

        const newProject = await new Project({
            adminId,
            annotators,
            name,
            description,
            filename: file.name,
        });
        const existing = await Project.findOne({ name });
        if (existing) {
            return NextResponse.json({ error: "This Project is already Added" }, { status: 400 });
        }
        await newProject.save();
        
        let count = 0;
        for (const row of parsed.data) {
            const translatedText = row.tgt_text?.trim() || "NA";
            const textFilter = {
                projectId: newProject._id,
                sentence: row.src_txt,
                language: row.src_lang
            };
            let textDoc = await Text.findOne(textFilter);
            if (!textDoc) {
                textDoc = await Text.create(textFilter);
            }
                
            const annotationFilter = {
                textId: textDoc._id,
                annotatorId: annotators[count]
            };
            const existingAnnotation = await Annotation.findOne(annotationFilter);
        
            // If not, create and save it
            if (!existingAnnotation) {
                await Annotation.create({
                    ...annotationFilter,
                    translatedText: translatedText,
                    language: row.tgt_lang || "en"
                });
            }
        
            // 3. Rotate annotator index
            count = (count + 1) % annotators.length;
        }

        return NextResponse.json({ message: "Project added successfully" }, { status: 201 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
