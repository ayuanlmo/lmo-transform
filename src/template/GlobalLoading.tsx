import * as React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";

function GlobalLoading(): React.JSX.Element {
    const isLoading: boolean = useSelector((state: RootState) => state.app.globalLoading);

    return (
        <div
            className={'lmo_position_absolute'}
            style={{
                width: "100%",
                height: " 100%",
                zIndex: 10,
                display: isLoading ? 'block' : 'none',
                background: "#0000008f"
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
