import { redirect } from "next/navigation";

export default function SpeakingPage() {
  redirect("/practice?mode=speaking");
}
