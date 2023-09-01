import React, { type ReactElement, type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <>
      <Navbar />
      <main className="min-h-screenNav w-full bg-gray-50">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
