import AuthCheck from '@/components/modules/admin/AuthCheck';
import AdminHeader from '@/components/modules/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck>
      <AdminHeader />
      <main>{children}</main>
    </AuthCheck>
  );
} 