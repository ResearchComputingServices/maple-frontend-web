"use client";
import { NavbarTop } from 'app/_components/navbars';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div id="db-wrapper">
			<div>
				<div className="header">
					<NavbarTop />
				</div>
				{children}
			</div>
		</div>
	);
}

export default Layout;