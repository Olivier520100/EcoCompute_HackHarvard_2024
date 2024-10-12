import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Example max size (5MB)
const ACCEPTED_FILE_TYPE = "application/json"; // Only accept JSON files

export const formSchema = z.object({
  uploadedFiles: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
        )
        .refine(
          (file) => file.type === ACCEPTED_FILE_TYPE,
          `Only files of type ${ACCEPTED_FILE_TYPE} are allowed.`
        )
    )
    .length(5, "You must upload exactly 5 files.") // Ensure exactly 5 files are uploaded
});
