import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAppStore } from "../../store/store";

function SuccessAlert() {
  // ----------- variables ---------------
  const MySwal = withReactContent(Swal);
  const alertType = useAppStore((state) => state.alertType);
  const alertMsg = useAppStore((state) => state.alertMsg);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);

  // ----------- functions ---------------
  useEffect(() => {
    if (alertType === "Success") {
      MySwal.fire({
        html: <p>{alertMsg}</p>,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        alertTypeChange("none");
        alertMsgChange("");
      }, 2000);
    }
  }, [alertType]);

  return <></>;
}

export default SuccessAlert;
