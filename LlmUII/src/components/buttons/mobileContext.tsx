import React from "react";
import { ContextMenuState, ContextMenuType } from "../contextMenu";
import type { IdType } from "vis-network";

interface Props {
    contextMenuState: ContextMenuState;
    selection: IdType[];
    setContextMenuState: (data: ContextMenuState) => void;
    darkMode: boolean;
}

const MobileContextButton: React.FC<Props> = React.memo(
    ({ contextMenuState, setContextMenuState, selection, darkMode }) => {
        return (
            <div
                
              
            />
        );
    }
);

export default MobileContextButton;
