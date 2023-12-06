import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as squaresListActions } from "../../Store/squareSlice/square.slice.ts"
import { actions as headerActions } from "../../Store/skinManagmentSlice/skinManagment.slice";

const rootActions = {
    ...squaresListActions,
    ...headerActions
};

export const useActions = () => {
    const dispatch = useDispatch();
    return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch])
}
