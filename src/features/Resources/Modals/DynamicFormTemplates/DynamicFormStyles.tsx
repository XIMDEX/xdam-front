import { Theme, createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: '100%'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    btnPreview: {
      height: 300,
    },
    blur: {
      filter: "blur(2px)",
    },
    addPreview: {
      display: 'none',
      position: 'absolute',
      zIndex: 1,
      left: '7%',
      top: 190,
      userSelect: 'none',
      pointerEvents: 'none'
    },
    dblock: {
      display: 'block'
    },
    formTag: {
      minHeight: 300
    },
    btnGroup: {
      width: '80%',
    },
    divider: {
      padding: '10px 0'
    },
    dismiss: {
      opacity: 1,
      transition: 'opacity 2s ease-'
    },
    imgView: {
      width: '100%'
    }
    
  }),
);

export default useStyles;