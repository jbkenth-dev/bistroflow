import { StaffShell } from "@/components/staff-shell";

export const metadata = { title: "Staff Portal – Bistroflow" };

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffShell>{children}</StaffShell>;
}
