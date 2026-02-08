import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
 import { ReservationClient } from "@/components/reservation-client";

export const metadata = {
  title: "Reservation – Bistroflow",
  description: "Reservation Experience (UI only)"
};

export default function ReservationPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <ReservationClient />
      </main>
      <Footer />
    </div>
  );
}
