export const MenuStyle = {
   container: {
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
    },
    itemContainer:{
        width: 200,
        display: "flex",
        flexDirection: "column",
      },
      item: { width: "100%", padding: "0.5rem", margin: "0" },
      transformOrigin:{ horizontal: "right", vertical: "top" },
      anchorOrigin:{ horizontal: "right", vertical: "bottom" }
}