import * as React from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";

function AppContent():React.JSX.Element {
    return(
        <div className={'lmo-app-content'}>
            <DropFile />
            <AppFooter />
        </div>
    );
}

export default AppContent;
