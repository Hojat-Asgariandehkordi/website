import { allLessons, nextLesson } from "./content";

/** The lesson to show behind "Continue where you left off". */
export function continueLesson(lastModule: string | null, lastLesson: string | null, completed: Set<string>) {
  if (lastModule && lastLesson) {
    const key = `${lastModule}/${lastLesson}`;
    const found = allLessons().find((x) => x.key === key);
    if (found && !completed.has(key)) return found;
  }
  return nextLesson(completed);
}
