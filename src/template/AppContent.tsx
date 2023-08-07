import * as React from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";
import Resource from "./Resource";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";

function AppContent(): React.JSX.Element {
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);

    return (
        <div className={'lmo-app-content'}>
            {
                selectedFiles.length === 0 ? <DropFile/> : <Resource/>
            }
            <AppFooter/>
        </div>
    );
}

export default AppContent;
