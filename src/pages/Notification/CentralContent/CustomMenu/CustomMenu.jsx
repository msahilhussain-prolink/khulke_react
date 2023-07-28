import { Divider, Menu, MenuItem } from "@mui/material";
import { allWords } from "../../../../App";
import { MenuStyle } from "./MenuStyle";

const CustomMenu = ({anchorEl, handleClose, handleCopy, open}) => (
    <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={MenuStyle.container}
        transformOrigin={MenuStyle.transformOrigin}
        anchorOrigin={MenuStyle.anchorOrigin}
      >
        <div
          style={MenuStyle.itemContainer}
        >
            <>
              <MenuItem
                style={MenuStyle.item}
                onClick={() => {
                  handleCopy()
                }}
              >
                {allWords.misc.livert.copy}
              </MenuItem>
            </>
            </div>
      </Menu>
)

export default CustomMenu;