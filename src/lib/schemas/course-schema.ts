import { z } from "zod";

import type { Course } from "@/lib/types";

export const MAX_INSTRUCTORS = 3;
export const COURSE_TITLE_MAX = 100;
export const COURSE_DESCRIPTION_MAX = 100;

const instructorSchema = z.object({
	name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
	email: z
		.string()
		.trim()
		.regex(/@cmu\.ac\.th$/i, "ต้องเป็นอีเมล @cmu.ac.th"),
});

export const choicesemester = [
  { id: "1", label: "ภาคการศึกษาที่ 1" },
  { id: "2", label: "ภาคการศึกษาที่ 2" },
  { id: "3", label: "ภาคฤดูร้อน" },
];

export const courseFormSchema = z.object({
	courseId: z
		.string()
		.trim()
		.regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
	courseTitle: z
		.string()
		.trim()
		.min(1, "กรอกชื่อวิชา")
		.max(COURSE_TITLE_MAX, `ชื่อวิชายาวได้ไม่เกิน ${COURSE_TITLE_MAX} ตัวอักษร`),
	instructors: z
		.array(instructorSchema)
		.min(1, "เพิ่มผู้สอนอย่างน้อย 1 คน")
		.max(MAX_INSTRUCTORS, `เพิ่มผู้สอนได้ไม่เกิน ${MAX_INSTRUCTORS} คน`)
		.refine(
			(items) => {
				const emails = items.map((item) => item.email.trim().toLowerCase());
				return new Set(emails).size === emails.length;
			},
			{ message: "อีเมลผู้สอนซ้ำกัน" },
		),
	program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }),
	semester: z.enum(["1", "2", "3"], { message: "เลือกภาคการศึกษา" }),
	description: z
		.string()
		.max(
			COURSE_DESCRIPTION_MAX,
			`รายละเอียดต้องไม่เกิน ${COURSE_DESCRIPTION_MAX} ตัวอักษร`,
		),
	notifyByEmail: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export function createCourseFormSchema(existingCourses: Course[]) {
	return courseFormSchema.refine(
		(data) => !existingCourses.some((course) => course.courseId === data.courseId),
		{
			message: "รหัสวิชานี้มีอยู่แล้ว",
			path: ["courseId"],
		},
	);
}
