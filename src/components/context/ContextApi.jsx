import React, { useContext, useMemo, useState } from "react";

export const ContextProvider = React.createContext({
  userState: () => {},
  setUserState: () => {},
});

const ContextApi = (props) => {
  const [userState, setUserState] = useState(false);

  const passedValues = useMemo(() => {
    return {
      userState,
      setUserState,
    };
  }, [userState]);
  return (
    <React.Fragment>
      <ContextProvider.Provider value={passedValues}>
        {props.children}
      </ContextProvider.Provider>
    </React.Fragment>
  );
};

export default ContextApi;

//custom hook
export const useContextAPI = () => {
  return useContext(ContextProvider);
};
