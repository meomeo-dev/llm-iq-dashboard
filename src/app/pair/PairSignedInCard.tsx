export function PairSignedInCard({
  signedIn,
  returnTo,
  onSignOut,
}: {
  signedIn: string;
  returnTo: string;
  onSignOut: () => Promise<void>;
}) {
  return (
    <section className="pair-card">
      <p>
        本浏览器已作为 <b>{signedIn}</b> 登录。
      </p>
      <div className="actions">
        <a className="button" href={returnTo}>
          继续
        </a>
        <button type="button" onClick={() => void onSignOut()}>
          退出本设备
        </button>
      </div>
    </section>
  );
}
