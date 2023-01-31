import React, {createContext, useContext, useState} from 'react';

export const TabBarContext = createContext<any>(0);

const TabBarProvider = ({children}: any) => {
    const [showTabBar, setShowTabBar] = useState(true);

    return (
        <TabBarContext.Provider
            value={{
                showTabBar,
                setShowTabBar,
            }}>
            {children}
        </TabBarContext.Provider>
    );
};

interface TabBarType {
    showTabBar: boolean;
    setShowTabBar: any;
}
export const useTabBar = (): TabBarType => useContext(TabBarContext);

export default TabBarProvider;
