"use client";

import { usePairForm } from "./use-pair-form";
import { PairSignedInCard } from "./PairSignedInCard";
import { PairCodeForm } from "./PairCodeForm";

/** 配对码输入；已登录时改为显示当前设备与退出按钮 */
export function PairForm({
  returnTo,
  signedInAs,
}: {
  returnTo: string;
  signedInAs: string | null;
}) {
  const { code, setCode, status, signedIn, submit, signOut } = usePairForm(
    returnTo,
    signedInAs,
  );

  if (signedIn !== null) {
    return (
      <PairSignedInCard
        signedIn={signedIn}
        returnTo={returnTo}
        onSignOut={signOut}
      />
    );
  }

  return (
    <PairCodeForm
      code={code}
      status={status}
      onChangeCode={setCode}
      onSubmit={submit}
    />
  );
}
