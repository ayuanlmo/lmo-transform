import * as React from "react";

function GlobalLoading(): React.JSX.Element {
    return (
        <div
            className={'lmo_position_absolute'}
            style={{
                width: "100%",
                height: " 100%",
                zIndex: 10,
                background: " #0000008f"
            }}>
            <div
                className={'lmo_position_relative'}
                style={{
                    width: "135px",
                    margin: "auto",
                    top: " calc((100vh - 140px) / 2)",
                }}>
                <img
                    style={{
                        transform: "scale(0.48)"
                    }}
                    src={require('../static/svg/loading.svg').default} alt="loading"/>
            </div>
        </div>
    );
}

export default GlobalLoading;
