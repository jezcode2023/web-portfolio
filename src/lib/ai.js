import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyD2U00k2_MMpDaAVtT61QCfBrbWgTMuLao"});

export async function askAI(prompt) {
const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents: prompt,
config: {
responseMimeType: "application/json",
systemInstruction: `
Create function studentsAnalyzer(subjectId):

Fetch all students + grades filtered by subject from Supabase

Send data to Gemini (convert to string)

Return structured JSON:

{
"analysis": "The students of NET1 show consistent improvement across terms...",
"passedStudents": ["Maria Cruz", "John Dela Cruz"],
"failedStudents": ["Juan Santos"]
}

Rules:
In analysis, don't give the subject id instead use subject name
Passing Grades are 1-3.0
Failing Grades are 4.0-5.0

`,
},
});

return (response.text);
}