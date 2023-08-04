import * as React from 'react';
import HeaderControls from "./template/HeaderControls";
require('./style/lmo-default.t.css');

function Root(): React.JSX.Element {
    return (
        <div>
            <HeaderControls />
            <header>
               <h2>Hello lmo</h2>
            </header>
        </div>
    );
}

export default Root;
