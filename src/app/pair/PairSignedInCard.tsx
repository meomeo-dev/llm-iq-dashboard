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
      <div className="actions">
        <a className="button" href={returnTo}>
          {isEn ? "Continue" : "继续"}
        </a>
        <button type="button" onClick={() => void onSignOut()}>
          {isEn ? "Sign Out This Device" : "退出本设备"}
        </button>
      </div>
    </section>
  );
}
