import React from "react";

interface LayoutProps  {
	children: React.ReactNode
}

const layout = ({children}: LayoutProps) => {
	return <main className="auth">{children}</main>;
};

export default layout
