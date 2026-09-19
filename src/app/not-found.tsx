import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("https://travingat.com/404");
}
