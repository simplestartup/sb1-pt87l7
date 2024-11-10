import ClientLayout from "@/components/layout/client-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}