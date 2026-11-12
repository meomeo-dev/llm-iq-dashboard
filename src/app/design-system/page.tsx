import { notFound } from "next/navigation";
import { DesignSystemPreview } from "./DesignSystemPreview";
import "./design-system.css";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DesignSystemPreview />;
}
