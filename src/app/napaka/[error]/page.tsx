import { Card } from "@/components/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { PleaseLinkGithubAccountError } from "@/components/please-link-github-account-error";

type Params = {
  params: Promise<{ error: string }>;
};

export default async function Page({ params }: Params) {
  const { error } = await params;

  const showError = (error: string) => {
    switch (error.toLowerCase()) {
      case "auth-github-user-not-found":
        return <PleaseRegisterViaGithubError />;
      case "auth-github-link-account":
        return <PleaseLinkGithubAccountError />;
      case "auth-github-link-exist":
        return <GithubLinkExistsError />;
    }
  };

  return <div className="grid grid-cols-1 gap-3 container w-page">{showError(error)}</div>;
}

const PleaseRegisterViaGithubError = () => {
  return (
    <Card>
      <div className="text-center py-6">
        <h1 className={"font-semibold text-2xl mb-3"}>Uporabniški račun ne obstaja!</h1>
        <p>
          Glej, nismo našli nobenega uporabniškega računa vezanega na ta GitHub račun.
          <br /> Pomaga, če se najprej registriraš z uporabo GitHuba.
        </p>

        <div className="mt-6">
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/redirect?flow=register`}>
            <button className="btn btn-sm btn-primary">
              <FontAwesomeIcon icon={faGithub} className={"mr-2"} />
              Registriraj se z GitHub
            </button>
          </a>
        </div>
      </div>
    </Card>
  );
};

const GithubLinkExistsError = () => {
  return (
    <Card>
      <div className="text-center py-6">
        <h1 className={"font-semibold text-2xl mb-3"}>Ta GitHub račun je že povezan z drugim računom!</h1>

        <p>Najprej odstrani povezavo z obstoječim računom in nato pononovno poskusi povezati.</p>
      </div>
    </Card>
  );
};
