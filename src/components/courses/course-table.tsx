import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Badge } from "../ui/badge";

import { choicesemester } from "@/lib/schemas/course-schema";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{course.program}</Badge>
                </div>
              </TableCell>
              <TableCell>
                {choicesemester.find((x) => x.id === course.semester)?.label}
              </TableCell>
              <TableCell>
                <span className="block max-w-[180px] line-clamp-2 whitespace-normal break-words text-muted-foreground">
                  {course.description}
                </span>
              </TableCell>
              <TableCell>
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  <div>
                    {course.instructors.map((instructor) => (
                      <div key={instructor.email}>
                        <div>{instructor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {instructor.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {course.notifyByEmail===true ? 
                <Badge> {"รับ"} </Badge> : 
                <Badge variant="secondary"> {"ไม่รับ"} </Badge>}
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
