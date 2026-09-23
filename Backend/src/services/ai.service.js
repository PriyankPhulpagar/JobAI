const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "The match score between the candidate and the job description, ranging from 0 to 100."
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview, along with their intention and answer.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question that can be asked in the interview." },
                    intention: { type: Type.STRING, description: "The intention behind the technical question asked." },
                    answer: { type: Type.STRING, description: "How to answer the technical question asked in the interview." },
                },
                required: ["question", "intention", "answer"],
            },
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview, along with their intention and answer.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question that can be asked in the interview." },
                    intention: { type: Type.STRING, description: "The intention behind the behavioral question asked." },
                    answer: { type: Type.STRING, description: "How to answer the behavioral question asked in the interview." },
                },
                required: ["question", "intention", "answer"],
            },
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "Skill gaps that the candidate has, along with their severity.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill that the candidate is lacking." },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of the skill gap." },
                },
                required: ["skill", "severity"],
            },
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "Preparation plan for the candidate to improve their skills and prepare for the interview.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day of the preparation plan." },
                    focus: { type: Type.STRING, description: "The focus of the preparation plan for that day." },
                    tasks: {
                        type: Type.ARRAY,
                        description: "The tasks to be completed for the preparation plan for that day.",
                        items: { type: Type.STRING },
                    },
                },
                required: ["day", "focus", "tasks"],
            },
        },
        // Added — was present in the first file's schema but missing here.
        title: {
            type: Type.STRING,
            description: "The title of the job for which the interview report is generated."
        },
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"],
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate based on the following information:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}`


        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
            },
        });

        return JSON.parse(response.text);

}

// ── Everything below was missing from the second file and is added from the first ──

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

const resumePdfSchema = {
    type: Type.OBJECT,
    properties: {
        html: {
            type: Type.STRING,
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer."
        },
    },
    required: ["html"],
};

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema,
            }
        })

        const jsonContent = JSON.parse(response.text)

        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

        return pdfBuffer

    } catch (error) {
        console.error("Error generating resume PDF:", error.message);
        return null;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };