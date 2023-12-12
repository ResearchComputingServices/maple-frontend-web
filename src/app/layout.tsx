import 'styles/theme.scss';

export const metadata = {
    title: 'RCS: Maple - RTPT'
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}

export default Layout;