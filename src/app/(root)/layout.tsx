import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  const loggedIn = { firstname: 'Steve', lastName: 'JSM', id:'1', email: '', userId: 'string;',  dwollaCustomerUrl: 'string;', dwollaCustomerId: 'string;', firstName: 'string;',  city: 'string', state: 'string;', address1: 'string;', postalCode: 'string', dateOfBirth: 'string;', ssn: 'string;' };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} /> 
       {children}
    </main>
  );
}
