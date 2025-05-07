"use client";

import { useContext } from "react";
import { AuthContext } from "@/hooks/auth-provider";
import { Card } from "@/components/card";

export const PleaseLinkGithubAccountError = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Card>
      <div className="text-center py-6">
        <h1 className={"font-semibold text-2xl mb-3"}>Ta GitHub račun še ni povezan!</h1>
        <p>Našli smo Klele.si uporabniški račun z enakim emailom, ampak še ni povezan s tem GitHub računom.</p>

        <p>Priporočamo, da ročno povežeš račun prek uporabniškega profila.</p>

        <div className="mt-6">
          {currentUser ? (
            <a href={`/profil`}>
              <button className="btn btn-sm btn-primary">Profil</button>
            </a>
          ) : (
            <a href={`/prijava`}>
              <button className="btn btn-sm btn-primary">Prijava</button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};
