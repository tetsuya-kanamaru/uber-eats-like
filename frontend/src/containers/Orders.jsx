import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import { OrderDetailItem } from "../components/OrderDetailItem";
import { OrderButton } from "../components/Buttons/OrderButton";

import { fetchLineFoods } from "../apis/line_foods";
import { postOrder } from "../apis/orders";

import {
  initialState,
  lineFoodsActionTypes,
  lineFoodsReducer,
} from "../reducers/lineFoods";

import MainLogo from "../images/logo.png";

import { REQUEST_STATE } from "../constants";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 32px;
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderitemWrapper = styled.div`
  margin-bottom: 50px;
`;

export const Orders = () => {
  const [state, dispatch] = useReducer(lineFoodsReducer, initialState);

  useEffect(() => {
    dispatch({ type: lineFoodsActionTypes.FETCHING });
    fetchLineFoods().then((data) =>
      dispatch({
        type: lineFoodsActionTypes.FETCH_SUCCESS,
        payload: {
          lineFoodsSummary: data,
        },
      })
    );
    // .catch((e) => console.error(e));
  }, []);

  const postLineFoods = () => {
    dispatch({ type: lineFoodsActionTypes.POSTING });
    postOrder({
      line_food_ids: state.lineFoodsSummary.line_food_ids,
    }).then(() => {
      dispatch({ type: lineFoodsActionTypes.POST_SUCCESS });
    });
    window.location.reload();
  };

  const orderButtonLabel = () => {
    switch (state.postState) {
      case REQUEST_STATE.LOADING:
        return "注文中...";
      case REQUEST_STATE.OK:
        return "注文が完了しました！";
      default:
        return "注文を確定する";
    }
  };

  return (
    <>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
      </HeaderWrapper>
      <OrderListWrapper>
        <div>
          <OrderitemWrapper>
            {state.fetchState === REQUEST_STATE.LOADING ? (
              <CircularProgress />
            ) : (
              state.lineFoodsSummary && (
                <OrderDetailItem
                  restaurantId={state.lineFoodsSummary.restaurant.id}
                  restaurantName={state.lineFoodsSummary.restaurant.name}
                  restaurantFee={state.lineFoodsSummary.restaurant.fee}
                  timeRequired={state.lineFoodsSummary.restaurant.time_required}
                  foodCount={state.lineFoodsSummary.count}
                  price={state.lineFoodsSummary.amount}
                />
              )
            )}
          </OrderitemWrapper>
          <div>
            {state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary && (
              <OrderButton
                onClick={() => postLineFoods()}
                disabled={
                  state.postState === REQUEST_STATE.LOADING ||
                  state.postState === REQUEST_STATE.OK
                }
              >
                {orderButtonLabel()}
              </OrderButton>
            )}
            {state.fetchState === REQUEST_STATE.OK &&
              !state.lineFoodsSummary && <p>注文予定の商品はありません</p>}
          </div>
        </div>
      </OrderListWrapper>
    </>
  );
};
