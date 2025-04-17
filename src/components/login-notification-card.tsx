import { Card } from "@/components/card";
import { ReactNode } from "react";

export const LoginNotificationCard = () => {
  return (
    <Card>
      <div className="text-center py-6">
        <h3 className={"font-semibold text-xl mb-6"}>Hah. Brez prijave ne bo šlo.</h3>
        <a href="/prijava">
          <button className="btn btn-primary">Prijava</button>
        </a>
      </div>
    </Card>
  );
};
