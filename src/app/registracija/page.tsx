"use client";

import { Card } from "@/components/card";
import FormInput from "@/components/form-input";
import { z, ZodError } from "zod";
import { FormEvent, useContext, useEffect, useState } from "react";
import useUserApi from "@/hooks/useUserApi";
import { AuthContext } from "@/hooks/auth-provider";
import { AxiosError } from "axios";
import Shimmer from "@/components/shimmer";
import { ValidationErrorResponse } from "@/interfaces";

const schema = z
  .object({
    name: z.string().min(1, "Brez imena ne bo šlo."),
    username: z.string().min(1, "Brez uporabniškega imena ne bo šlo."),
    email: z.string().email("Email mora imeti vsaj @ in zgledati kot email."),
    password: z.string().min(8, "Geslo mora biti vsaj 8 znakov."),
    confirmTOS: z.boolean().refine((data) => data, { message: "Tole je obvezno." }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Obe gesli se morata ujemati.",
    path: ["passwordConfirmation"],
  });

enum ViewState {
  SAVING,
  IDLE,
}

interface Form {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  confirmTOS: boolean;
}

function RegisterForm({ onSuccess = () => {} }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
    confirmTOS: false,
  });
  const [validation, setValidation] = useState<ZodError<Form> | null>(null);
  const [serverError, setServerError] = useState<ValidationErrorResponse | null>(null);
  const { register } = useUserApi();
  const { loginUser } = useContext(AuthContext);
  const [currentState, setCurrentState] = useState(ViewState.IDLE);

  const validate = (data: Form) => {
    try {
      schema.parse(data);
      setValidation(null);
    } catch (e) {
      setValidation(e as ZodError);
      return false;
    }

    return true;
  };

  const onFormChange = (change: string, value: string | number | boolean) => {
    setForm((prev) => {
      // @ts-expect-error: setting a prop via string type
      prev[change] = value;
      validate(prev);
      return { ...prev };
    });

    setServerError(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (validate(form)) {
      setCurrentState(ViewState.SAVING);

      register(form).then(
        (response) => {
          loginUser(response.data.data);
          if (onSuccess) {
            onSuccess();
          }
        },
        (error: AxiosError) => {
          if (error.response) {
            setServerError(error.response.data as ValidationErrorResponse);
          }
          setCurrentState(ViewState.IDLE);
        },
      );
    }
  };

  return (
    <div className="py-6">
      <div className="text-center">
        <h1 className={"text-3xl font-bold mb-6"}>Registracija</h1>
      </div>

      <form action="" onSubmit={(event) => submit(event)}>
        <FormInput
          label={"Ime:"}
          type={"text"}
          name={"name"}
          value={form.name}
          error={validation?.format().name?._errors.join(". ")}
          onChange={(prop, value) => onFormChange(prop, value)}
          disabled={currentState === ViewState.SAVING}
        />

        <FormInput
          label={"Email:"}
          type={"email"}
          name={"email"}
          value={form.email}
          error={validation?.format().email?._errors.join(". ") ?? serverError?.errors?.email?.join(". ")}
          onChange={(prop, value) => onFormChange(prop, value)}
          autocomplete={"email"}
          disabled={currentState === ViewState.SAVING}
        />

        <FormInput
          label={"Uporabniško ime:"}
          type={"text"}
          name={"username"}
          value={form.username}
          error={validation?.format().username?._errors.join(". ") ?? serverError?.errors?.username?.join(". ")}
          onChange={(prop, value) => onFormChange(prop, value)}
          autocomplete={"off"}
          disabled={currentState === ViewState.SAVING}
        />

        <FormInput
          label={"Geslo:"}
          type={"password"}
          name={"password"}
          value={form.password}
          error={validation?.format().password?._errors.join(". ")}
          autocomplete={"new-password"}
          onChange={(prop, value) => onFormChange(prop, value)}
          disabled={currentState === ViewState.SAVING}
        />

        <FormInput
          label={"Ponovi geslo:"}
          type={"password"}
          name={"passwordConfirmation"}
          error={validation?.format().passwordConfirmation?._errors.join(". ")}
          value={form.passwordConfirmation}
          onChange={(prop, value) => onFormChange(prop, value)}
          disabled={currentState === ViewState.SAVING}
        />

        <div className={"mt-6 prose"}>
          <label className={"flex flex-row items-center"}>
            <input
              disabled={currentState === ViewState.SAVING}
              className={"inline h-4" + " w-4 mr-4"}
              type="checkbox"
              checked={form.confirmTOS}
              onChange={() => onFormChange("confirmTOS", !form.confirmTOS)}
            />
            <span>
              strinjam se s{" "}
              <a href="/pravila" target={"_blank"}>
                pravili
              </a>{" "}
              in{" "}
              <a href="/politika-zasebnosti" target={"_blank"}>
                politko zasebnosti
              </a>
            </span>
          </label>

          <p className="text-error mt-2">{validation?.format().confirmTOS?._errors.join(". ")}</p>
        </div>

        <div className={"text-center mt-10"}>
          <button className="btn btn-primary" disabled={!!validation || currentState === ViewState.SAVING || serverError != null}>
            Registriraj se
          </button>
        </div>
      </form>

      <hr className="my-10" />

      <div className="text-center">
        <h2 className="text-xl font-bold mb-6">Že imaš račun?</h2>

        <a href="/prijava">
          <button className="btn btn-sm btn-primary-outline" disabled={currentState === ViewState.SAVING}>
            Prijavi se
          </button>
        </a>
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div className={"py-6 text-center"}>
      <h2 className={"text-3xl font-bold mb-6"}>Čestitke!</h2>

      <p className={"mb-3"}>Zelo nas veseli, da smo te prepričali, da postaneš del naše skupnosti.</p>

      <p>Tvoj račun je ustvarjen, prav tako smo te že prijavili.</p>
      <p></p>
    </div>
  );
}

enum PageState {
  CHECKING,
  REGISTER,
  SUCCESS,
}

export default function Page() {
  const [currentState, setCurrentState] = useState(PageState.CHECKING);
  const { checkLogin } = useUserApi();

  useEffect(() => {
    checkLogin(() => setCurrentState(PageState.REGISTER));
  }, []);
  return (
    <div>
      <main className={"grid grid-cols-1 gap-3"}>
        <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
          <Card>
            <div>{currentState === PageState.SUCCESS && <SuccessState />}</div>
            <div>{currentState === PageState.REGISTER && <RegisterForm onSuccess={() => setCurrentState(PageState.SUCCESS)} />}</div>
            <div>
              {currentState === PageState.CHECKING && (
                <div className="grid grid-cols-1 gap-3">
                  <Shimmer height={"2rem"} />
                  <Shimmer height={"1.5rem"} />
                  <Shimmer height={"2rem"} />
                  <Shimmer height={"2rem"} />
                  <Shimmer height={"1.5rem"} />
                  <Shimmer height={"1rem"} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
