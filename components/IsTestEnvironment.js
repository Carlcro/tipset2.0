import React from "react";

export default function IsTestEnvironment() {
  return (
    <>
      {process.env.NEXT_PUBLIC_ENVIRONMENT === "TEST" ? (
        <div>TEST ENVIRONMENT</div>
      ) : null}
    </>
  );
}
