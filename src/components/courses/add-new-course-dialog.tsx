import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, X, RotateCcw} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Controller,
  useFieldArray,
  useForm,
  type DefaultValues,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import {
//   emptyCourseForm,
//   validateCourseField,
//   validateCourseForm,
//   type CourseFormErrors,
//   type CourseFormValues,
// } from "@/lib/course-validation";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import {
  createCourseFormSchema,
  choicesemester,
  COURSE_DESCRIPTION_MAX,
  MAX_INSTRUCTORS,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
/**
 *   (Lab 17): เขียนฟอร์มนี้ใหม่ด้วย Zod + React Hook Form
 *   (ดูตัวอย่างใน components/students/add-new-student-dialog.tsx)
 *   - schema ใหม่ที่ src/lib/schemas/course-schema.ts (แทน course-validation.ts)
 *   - ผู้สอนเป็น Array Fields (useFieldArray) — ชื่อ + อีเมล @cmu.ac.th, 1–3 คน
 *   - หลักสูตร (Select), ภาคการศึกษา (Radio Group), รายละเอียด (Textarea 0/100),
 *     รับข่าวสารทางอีเมล (Switch)
 */

const emptyCourseForm: DefaultValues<CourseFormValues> = {
  courseId: "",
  courseTitle: "",
  instructors: [{ name: "", email: "" }],
  program: undefined,
  semester: undefined,
  description: "",
  notifyByEmail: false,
};

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => createCourseFormSchema(courses), [courses]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema), // ← ใช้ Zod ตรวจ
    defaultValues: emptyCourseForm,
    mode: "onBlur",
  });
  // // state ที่ต้องถือเองสามก้อน (Zod + React Hook Form จะรวมเป็น useForm ตัวเดียว)
  // const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
  // const [errors, setErrors] = useState<CourseFormErrors>({});
  // const [touched, setTouched] = useState<
  //   Partial<Record<keyof CourseFormValues, boolean>>
  // >({});

  // const [instructorInput, setInstructorInput] = useState("");
  // const instructorsAnchor = useComboboxAnchor();

  // const knownInstructors = [...new Set(courses.flatMap((c) => c.instructors))];
  // const typedInstructor = instructorInput.trim();
  // const isNewInstructor =
  //   typedInstructor.length > 0 &&
  //   !knownInstructors.some(
  //     (name) => name.toLowerCase() === typedInstructor.toLowerCase(),
  //   ) &&
  //   !values.instructors.includes(typedInstructor);
  // const instructorItems = [
  //   ...knownInstructors,
  //   ...values.instructors.filter((name) => !knownInstructors.includes(name)),
  //   ...(isNewInstructor ? [typedInstructor] : []),
  // ];

  // const checkField = (name: keyof CourseFormValues, next: CourseFormValues) => {
  //   setErrors((prev) => ({
  //     ...prev,
  //     [name]: validateCourseField(name, next, courses),
  //   }));
  // };

  // const handleChange = <K extends keyof CourseFormValues>(
  //   name: K,
  //   value: CourseFormValues[K],
  // ) => {
  //   const next = { ...values, [name]: value };
  //   setValues(next);
  //   // ช่องที่เคยออกไปแล้ว (touched) เช็กใหม่ทันทีตอนแก้ — error หายเมื่อแก้ถูก
  //   if (touched[name]) checkField(name, next);
  // };

  // // เทียบได้กับ mode: "onBlur" ของ React Hook Form
  // const handleBlur = (name: keyof CourseFormValues) => {
  //   setTouched((prev) => ({ ...prev, [name]: true }));
  //   checkField(name, values);
  // };

  // const resetForm = () => {
  //   setValues(emptyCourseForm);
  //   setErrors({});
  //   setTouched({});
  //   setInstructorInput("");
  // };

  // // ด่านตรวจก่อนเข้า store — เทียบได้กับ form.handleSubmit(onSubmit)
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const nextErrors = validateCourseForm(values, courses);
  //   setErrors(nextErrors);
  //   setTouched({ courseId: true, courseTitle: true, instructors: true });
  //   if (Object.keys(nextErrors).length > 0) return; // ไม่ผ่าน → ไม่เรียก addCourse

  //   addCourse({
  //     courseId: values.courseId.trim(),
  //     courseTitle: values.courseTitle.trim(),
  //     instructors: values.instructors,
  //   });
  //   resetForm();
  //   setOpen(false);
  // };

  // // ต้องต่อ id / aria-* / ข้อความ error เองทุกช่อง (<FormItem/FormControl/FormMessage> จะทำแทน)
  // const errorOf = (name: keyof CourseFormValues) =>
  //   touched[name] ? errors[name] : undefined;

  // const invalidProps = (name: keyof CourseFormValues) => ({
  //   "aria-invalid": errorOf(name) ? true : undefined,
  //   "aria-describedby": errorOf(name) ? `${name}-error` : undefined,
  // });

  // const fieldError = (name: keyof CourseFormValues) => {
  //   const message = errorOf(name);
  //   return message ? (
  //     <p id={`${name}-error`} className="text-sm text-destructive">
  //       {message}
  //     </p>
  //   ) : null;
  // };
  const resetForm = () => form.reset(emptyCourseForm);

  function onSubmit(values: CourseFormValues) {
    addCourse(values);
    resetForm();
    setOpen(false);
  }

  const programOptions = [
    { value: "CPE", label: "CPE — วิศวกรรมคอมพิวเตอร์" },
    { value: "ISNE", label: "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย" },
  ];

  const emailsError =
    form.formState.errors.instructors?.root ?? form.formState.errors.instructors;

  // ─── useFieldArray ───
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructors",
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              กรอกรหัสวิชา ชื่อวิชา และผู้สอน
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-1">
                <Controller
                  name="courseId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="courseId"> รหัสวิชา </FieldLabel>
                      <Input
                        {...field}
                        id="courseId"
                        placeholder="เช่น 261305"
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <Controller
                  name="courseTitle"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="courseTitle"> ชื่อวิชา </FieldLabel>
                      <Input
                        {...field}
                        id="courseTitle"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <Controller
              name="program"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="program">หลักสูตร</FieldLabel>
                  <Select
                    name={field.name}
                    items={programOptions}
                    value={field.value ?? null}
                    onValueChange={(v) => {
                      field.onChange(v);
                      field.onBlur();
                    }}
                  >
                    <SelectTrigger
                      id="program"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                      ref={field.ref}
                    >
                      <SelectValue placeholder="เลือกหลักสูตร" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="semester"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend variant="label">ภาคการศึกษา</FieldLegend>

                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                    }}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {choicesemester.map((semes) => (
                      <Field
                        key={semes.id}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                        className="flex items-center gap-3"
                      >
                        <RadioGroupItem
                          value={semes.id}
                          id={`semester-${semes.id}`}
                        />
                        <FieldLabel
                          htmlFor={`semester-${semes.id}`}
                          className="font-normal cursor-pointer"
                        >
                          {semes.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => {
                const currentValue = field.value || "";
                const currentLength = currentValue.length;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="block-end-textarea">
                      รายละเอียด (ไม่บังคับ)
                    </FieldLabel>

                    <InputGroup>
                      <InputGroupTextarea
                        id="block-end-textarea"
                        placeholder="คำอธิบายรายวิชาสั้น ๆ"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>

                    <InputGroupAddon align="block-end">
                      <InputGroupText> {currentLength}/{COURSE_DESCRIPTION_MAX} ตัวอักษร </InputGroupText>
                    </InputGroupAddon>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            <FieldSet data-invalid={!!emailsError?.message}>
              <FieldLegend variant="label"> ผู้สอน </FieldLegend>
              <FieldDescription>
                {fields.length}/{MAX_INSTRUCTORS} ผู้สอน — กรอกชื่อผู้สอน และอีเมล name@cmu.ac.th (ห้ามซ้ำกัน)
              </FieldDescription>

              <FieldGroup className="gap-3">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-3 md:grid-cols-[auto_1fr_1fr_auto]"
                  >
                    <FieldDescription className="self-center"> {index + 1}. </FieldDescription>
                    <Controller
                      name={`instructors.${index}.name`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={`instructor-name-${index}`}
                            className="sr-only"
                          >
                            ชื่อผู้สอนที่ {index + 1}
                          </FieldLabel>
                          <Input
                            {...field}
                            id={`instructor-name-${index}`}
                            placeholder="กรอกชื่อผู้สอน"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`instructors.${index}.email`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={`instructor-email-${index}`}
                            className="sr-only"
                          >
                            อีเมลผู้สอนที่ {index + 1}
                          </FieldLabel>
                          <Input
                            {...field}
                            id={`instructor-email-${index}`}
                            type="email"
                            placeholder="ต้องเป็นอีเมล @cmu.ac.th"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* ─── remove(index) ─── */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`ลบผู้สอนที่ ${index + 1}`}
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                      className="self-center"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </FieldGroup>

              {/* ─── Array Validation: error ระดับ array ─── */}
              {emailsError?.message && <FieldError errors={[emailsError]} />}

              {/* ─── append({...}) ─── */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={fields.length >= MAX_INSTRUCTORS}
                onClick={() => append({ name: "", email: "" })}
              >
                <Plus className="size-4" />
                เพิ่มผู้สอน
              </Button>
            </FieldSet>

            <Controller
              name="notifyByEmail"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                    <div className="space-y-1">
                      <FieldLabel htmlFor="notifyByEmail" className="font-medium">
                        รับข่าวสารทางอีเมล
                      </FieldLabel>
                      <FieldDescription>
                        แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                      </FieldDescription>
                    </div>
                    <Switch
                      id="notifyByEmail"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4" />
              ล้างฟอร์ม
            </Button>
            <Button type="submit"> บันทึก </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
