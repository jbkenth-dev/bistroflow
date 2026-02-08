 import { NavBar } from "@/components/nav-bar";
 import { Footer } from "@/components/footer";
 import { AboutClient } from "@/components/about-client";

 export const metadata = {
   title: "About – Bistroflow",
   description: "About BistroFlow: Integrated Food Order & Reservation System"
 };

 export default function AboutPage() {
   return (
     <div>
       <NavBar />
       <main className="pt-24 container-edge">
         <AboutClient />
       </main>
       <Footer />
     </div>
   );
 }
