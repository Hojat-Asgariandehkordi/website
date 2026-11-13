"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { addTeamMember, deleteScenario, deleteTeamMember, saveScenario, setChecklistItem, TEAM_STATUSES, updateTeamMember } from "@/lib/repo";
import { parseInputs } from "@/lib/calculator";
import { getChecklist, getRoles } from "@/lib/content";

const memberSchema = z.object({
  name: z.string().trim().min(1, "Add a name.").max(120),
  firm: z.string().trim().max(120).default(""),
  role: z.string().trim().min(1),
  status: z.enum(TEAM_STATUSES),
  notes: z.string().trim().max(2000).default(""),
});

export type TeamState = { error?: string } | undefined;

function readMember(form: FormData) {
  return memberSchema.safeParse({
    name: form.get("name"),
    firm: form.get("firm") ?? "",
    role: form.get("role"),
    status: form.get("status"),
    notes: form.get("notes") ?? "",
  });
}

export async function addTeamMemberAction(_: TeamState, form: FormData): Promise<TeamState> {
  const user = await requireUser("/deal-team");
  const parsed = readMember(form);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!getRoles().some((r) => r.slug === parsed.data.role)) return { error: "Choose a role." };
  addTeamMember(getDb(), user.id, parsed.data);
  revalidatePath("/deal-team");
  revalidatePath("/dashboard");
  return {};
}

export async function updateTeamMemberAction(form: FormData) {
  const user = await requireUser("/deal-team");
  const parsed = readMember(form);
  if (!parsed.success) return;
  updateTeamMember(getDb(), user.id, Number(form.get("id")), parsed.data);
  revalidatePath("/deal-team");
  revalidatePath("/dashboard");
}

export async function deleteTeamMemberAction(form: FormData) {
  const user = await requireUser("/deal-team");
  deleteTeamMember(getDb(), user.id, Number(form.get("id")));
  revalidatePath("/deal-team");
  revalidatePath("/dashboard");
}

export type ScenarioState = { error?: string; savedName?: string } | undefined;

export async function saveScenarioAction(_: ScenarioState, form: FormData): Promise<ScenarioState> {
  const user = await requireUser("/tools/affordability");
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  if (!name) return { error: "Give the scenario a name." };
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("inputs") ?? "{}"));
  } catch {
    return { error: "Those inputs could not be read." };
  }
  const inputs = parseInputs(raw);
  if (!inputs) return { error: "Check the inputs: every value must be a positive number." };
  saveScenario(getDb(), user.id, name, inputs);
  revalidatePath("/tools/affordability");
  revalidatePath("/dashboard");
  return { savedName: name };
}

export async function deleteScenarioAction(form: FormData) {
  const user = await requireUser("/tools/affordability");
  deleteScenario(getDb(), user.id, Number(form.get("id")));
  revalidatePath("/tools/affordability");
  revalidatePath("/dashboard");
}

export async function toggleChecklistAction(itemKey: string, checked: boolean) {
  const user = await requireUser("/tools/checklist");
  const valid = getChecklist().some((g) => g.items.some((i) => i.key === itemKey));
  if (!valid) return;
  setChecklistItem(getDb(), user.id, itemKey, checked);
  revalidatePath("/tools/checklist");
  revalidatePath("/dashboard");
}
