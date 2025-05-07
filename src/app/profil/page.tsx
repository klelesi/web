"use client";

import { Card } from "@/components/card";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Loader } from "@/components/loader";
import { ShowError } from "@/components/show-error";
import useUserApi from "@/hooks/useUserApi";
import { Auth } from "@/interfaces";
import { z } from "zod";
import FormInput from "@/components/form-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons/faTrashAlt";

enum State {
  LOADING,
  SAVING,
  IDLE,
  ERROR,
}

const schema = z.object({
  name: z.string().min(1, "Ime je obvezno!"),
});

interface ProfileInterface extends Auth {
  socialiteUsers: { id: string; provider: string }[];
}

export default function Page() {
  const { getProfile, updateProfile, deleteProvider } = useUserApi();
  const [state, setState] = useState(State.LOADING);
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [form, setForm] = useState<{ name: string }>({ name: "" });
  const [error, setError] = useState<AxiosError | undefined>();
  const [validation, setValidation] = useState(schema.safeParse(form));

  function onFormChange(change: string, value: string | number) {
    setForm((prev) => {
      // @ts-expect-error: setting a prop via string type
      prev[change] = value;
      setValidation(schema.safeParse(prev));
      return { ...prev };
    });
  }

  useEffect(() => {
    getProfile()
      .then((response) => response.data.data)
      .then(
        (profile) => {
          setProfile(profile as ProfileInterface);
          const newForm = { name: profile.name };
          setForm(() => newForm);
          setValidation(schema.safeParse(newForm));
          setState(State.IDLE);
        },
        (error: AxiosError) => {
          setError(error);
          setState(State.ERROR);
        },
      );
  }, []);

  function removeProvider(provider: string) {
    setState(State.SAVING);
    deleteProvider(provider)
      .then((response) => response.data.data as ProfileInterface)
      .then(
        (profile) => {
          setProfile((prev) => {
            return {
              ...prev,
              socialiteUsers: profile.socialiteUsers,
            } as ProfileInterface;
          });
          setState(State.IDLE);
        },
        (error: AxiosError) => {
          setError(error);
          setState(State.ERROR);
        },
      );
  }

  function update() {
    setState(State.SAVING);
    updateProfile(form)
      .then((response) => response.data.data)
      .then(
        (profile) => {
          setProfile(profile as ProfileInterface);
          const newForm = { name: profile.name };
          setForm(() => newForm);
          setValidation(schema.safeParse(newForm));
          setState(State.IDLE);
        },
        (error: AxiosError) => {
          setError(error);
          setState(State.ERROR);
        },
      );
  }

  return (
    <div>
      <main className={"grid grid-cols-1 gap-3"}>
        <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
          <Card>
            <div className=" py-6">
              <h1 className={"text-3xl font-bold mb-6 text-center"}>Profil</h1>

              {state === State.LOADING && <Loader />}

              {state === State.ERROR && <ShowError error={error as AxiosError} />}

              {(state === State.IDLE || state === State.SAVING) && (
                <div className={"grid grid-cols-1 gap-3"}>
                  <label>
                    Email
                    <input type="text" disabled={true} value={profile?.email} />
                  </label>

                  <label>
                    Uporabniško ime
                    <input type="text" disabled={true} value={profile?.username} />
                  </label>

                  <FormInput
                    label={"Ime"}
                    type={"text"}
                    name={"name"}
                    value={form.name}
                    error={validation.error?.flatten().fieldErrors.name?.join(" ")}
                    onChange={(prop, value) => onFormChange(prop, value)}
                    disabled={state === State.SAVING}
                  />

                  <hr className="mt-10 mb-2" />

                  <div className="text-right">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      onClick={() => update()}
                      disabled={!validation.success || state === State.SAVING}
                    >
                      Posodobi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {profile && (
            <>
              <Card>
                <h2 className="text-lg font-bold mb-3">Dodatni načini prijave</h2>

                <div className={"mb-3"}>
                  <FontAwesomeIcon icon={faGithub} className={"mr-1"} />
                  GitHub
                </div>

                {profile.socialiteUsers.filter((user) => user.provider === "github").length > 0 ? (
                  <button onClick={() => removeProvider("github")} className={"btn btn-sm btn-primary-outline"}>
                    <FontAwesomeIcon icon={faTrashAlt} className={"mr-2"} />
                    Odstrani
                  </button>
                ) : (
                  <>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/redirect?flow=link`}>
                      <button className="btn btn-sm btn-primary">Poveži</button>
                    </a>
                  </>
                )}
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
