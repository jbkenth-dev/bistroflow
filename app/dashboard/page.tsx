 import { NavBar } from "@/components/nav-bar";
 import { Footer } from "@/components/footer";
 import { CustomerDashboardClient } from "@/components/customer-dashboard-client";
 
 export const metadata = { title: "Your Dashboard – Bistroflow" };
 
 export default function CustomerDashboardPage() {
   return (
     <div>
       <NavBar />
       <main className="pt-24">
         <CustomerDashboardClient />
       </main>
       <Footer />
     </div>
   );
 }
