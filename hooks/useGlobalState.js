import { useContext } from "react";
import { Context } from "../Context";

const useGlobalState = () => {
	const globalState = useContext(Context);

	return globalState;
};

export default useGlobalState;
