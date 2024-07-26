import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstname: 'Steve', lastName: 'JSM', id: '1', email: '', userId: 'string;', dwollaCustomerUrl: 'string;', dwollaCustomerId: 'string;', firstName: 'string;', city: 'string', state: 'string;', address1: 'string;', postalCode: 'string', dateOfBirth: 'string;', ssn: 'string;' };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="lex size-full flex-col">
        <div className="root-layout">
          <div className="" style={{ display: "flex" }}>
            <Image src="/icons/logo.svg" width={30} height={30} alt="menu icon" />
            <p className="text-bankGradient" style={{ fontWeight: "800", marginLeft: "10px", alignSelf: "center" }}>Horizon</p>
          </div>
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
