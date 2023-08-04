import * as React from 'react';
import HeaderControls from "./template/HeaderControls";
import LeftMenu from "./template/LeftMenu";
import AppContent from "./template/AppContent";
require('./style/lmo-default.t.css');
require('./style/App.css');

function Root(): React.JSX.Element {
    return (
        <div>
            <HeaderControls />
            <div className={'lmo_app-content lmo_none_user_select'}>
                <LeftMenu />
                <AppContent />
            </div>
        </div>
    );
}

export default Root;
