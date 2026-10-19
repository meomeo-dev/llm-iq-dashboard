import { Button, ButtonLink } from "@/app/components/ui/Button";
import { useI18n } from "@/i18n";

export function PairSignedInCard({
  signedIn,
  returnTo,
  onSignOut,
}: {
  signedIn: string;
  returnTo: string;
  onSignOut: () => Promise<void>;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <section className="pair-card">
      <p>
        {isEn ? (
          <>
            Signed in on this browser as <b>{signedIn}</b>.
          </>
        ) : (
          <>
            本浏览器已作为 <b>{signedIn}</b> 登录。
          </>
        )}
      </p>
      <div className="pair-actions">
        <ButtonLink variant="primary" href={returnTo}>
          {isEn ? "Continue" : "继续"}
        </ButtonLink>
        <Button onClick={() => void onSignOut()}>
          {isEn ? "Sign Out This Device" : "退出本设备"}
        </Button>
      </div>
    </section>
  );
}
