import * as React from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";
import Resource from "./Resource";

function AppContent():React.JSX.Element {
    return(
        <div className={'lmo-app-content'}>
            <Resource />
            {/*<DropFile />*/}
            <AppFooter />
        </div>
    );
}

export default AppContent;
