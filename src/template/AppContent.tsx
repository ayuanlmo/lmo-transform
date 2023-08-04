import * as React from "react";
import AppFooter from "./AppFooter";

function AppContent():React.JSX.Element {
    return(
        <div className={'lmo-app-content'}>
            <AppFooter />
        </div>
    );
}

export default AppContent;
