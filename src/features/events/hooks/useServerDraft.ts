import { useCallback, useEffect, useState } from "react";
import { getDraftUpdate } from "../utils/draftSync";

/** Query data remains live; only accepted snapshots may reset the form. */
export function useServerDraft<T>({
  incoming,
  dirty,
  busy,
  onAdopt,
}: {
  incoming: T | undefined;
  dirty: boolean;
  busy: boolean;
  onAdopt: (snapshot: T) => void;
}) {
  const [baseline, setBaseline] = useState<T>();
  const action = getDraftUpdate(baseline, incoming, dirty, busy);
  const adopt = useCallback(
    (snapshot: T) => {
      onAdopt(snapshot);
      setBaseline(snapshot);
    },
    [onAdopt],
  );

  useEffect(() => {
    // Synchronize React Hook Form's external store and the accepted baseline
    // together, after render; resetting that store during render is unsafe.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (action === "adopt" && incoming !== undefined) adopt(incoming);
  }, [action, incoming, adopt]);

  return { baseline, adopt, changedElsewhere: action === "conflict" };
}
