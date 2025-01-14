import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    if (!session) {
        redirect('/');
    }
    return (
        <div>
            {children}
        </div>
    );
}

export default Layout;