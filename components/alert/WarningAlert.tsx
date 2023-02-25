import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAppStore } from "../../store/store";

function WarningAlert() {
  // ----------- variables ---------------
  const MySwal = withReactContent(Swal);
  const alertType = useAppStore((state) => state.alertType);
  const alertMsg = useAppStore((state) => state.alertMsg);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);

  // ----------- functions ---------------
  useEffect(() => {
    if (alertType === "Warning") {
      MySwal.fire({
        html: (
          <p style={{ whiteSpace: "pre-line" }}>
            {alertMsg.length < 30
              ? alertMsg
              : `${alertMsg.slice(0, 6)} ${alertMsg.slice(7, 22)}\n
                        ${alertMsg.slice(23)}`}
          </p>
        ),
        icon: "warning",
        showConfirmButton: true,
      });
      setTimeout(() => {
        alertTypeChange("none");
        alertMsgChange("");
      }, 2000);
    }
  }, [alertType]);

  return <></>;
}

export default WarningAlert;
