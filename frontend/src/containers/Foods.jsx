import React from "react";

export const Foods = (props) => {
  const { match } = props;

  return (
    <>
      フード一覧
      <p>restaurantIdは {match.params.restaurantId} です</p>
    </>
  );
};
