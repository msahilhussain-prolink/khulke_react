import { MOBILE_VIEW } from "../../../constants/env";

export const CategoryTagStyle = {
    container: {
        width: MOBILE_VIEW ? "23rem" : "100%",
        marginLeft: MOBILE_VIEW ? "-1rem" : "0rem",
        marginTop: "1.7rem",
        rowGap: MOBILE_VIEW ? "1rem" : 0,
        columnGap: MOBILE_VIEW ? 0 : "1rem",
      }
}