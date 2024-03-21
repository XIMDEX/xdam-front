import React,{useMemo, useState} from 'react'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { faPlusCircle, faCheckCircle, faXmarkCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { selectWorkspaceCollections, selectWorkspacesData, setWorkspacesData } from "../../../appSlice";
import { useDispatch, useSelector } from 'react-redux';
import MainService from '../../../api/service';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workspaceSelect: {
        width: '100%',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        '& .Mui-focused':{
            borderColor: 'red !important',
        }
    },
    workspacesActions:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonAddWorkspace:{
        backgroundColor: 'white',
        border: 'none',
        color: '#43A1A2',
        borderRadius: '50%',
    },
    addWorkspaceInput:{
        border: '1px solid grey',
        paddingLeft: '1em'
    }

  }),
);

interface IWkoptions {
    label?: string
    value?: number
  }

export default function WorkspaceSelect({resourceData, dataForUpdate, newWorkspaces, handleWorkspaceSelected}) {
    const classes = useStyles();
    const wps_data = useSelector(selectWorkspacesData);
    const wsp_collections = useSelector(selectWorkspaceCollections)
    const [workspaces, setWorkspaces] = useState(wps_data)
    const dispatch = useDispatch()
    const [addWorkspace,setAddWorkspace] = useState(false);
    const [newWorkspaceValue, setNewWorkspaceValue] = useState("");

    const workspaceDefault = useMemo(()=> {
        const wpsdefault = wps_data[process.env.REACT_APP_PUBLIC_WORKSPACE_ID]

        if (wpsdefault) {
            return [{label: wpsdefault.name, value: Number(wpsdefault.id)}]
        }
        return []
    }, [wps_data])

    const workspacesOptions = useMemo(()=>{
        let workspaceArray = []
        Object.keys(wsp_collections).map((number, _) => {
            let obj = {
                value: Number(wsp_collections[number].id),
                label: wsp_collections[number].name,
            }
            workspaceArray.push(obj)
        })
        return workspaceArray
    }, [wsp_collections])

    const setResource = (wsp) => {
        let wsp_news = {}
        Object.keys(wps_data).forEach(id => {
            if ( wsp.some(workspace => workspace == id)) {
                wsp_news[id] = wps_data[id]
            }
        })
        setWorkspaces(wsp_news)
    }

    const handleWorkspaceSelect = async (e: React.ChangeEvent<EventTarget>, values: Array<IWkoptions>) => {
        let newWorkspaces = []
        values.forEach(option => {
            let obj = {
                name: option.label,
                id: option.value,
            }
            newWorkspaces.push(obj)
        });
        setResource(newWorkspaces.map(workspace => workspace.id))
        handleWorkspaceSelected({wsp:newWorkspaces, resource_id: resourceData.id})
    };


    return (
        <div style={{display: 'flex'}}>
            <Autocomplete
                className={classes.workspaceSelect}
                multiple
                id="tags-standard"
                options={workspacesOptions}
                onChange={(e,values) => handleWorkspaceSelect (e, values)}
                defaultValue={workspacesOptions.filter((wkOption: IWkoptions) => newWorkspaces.some(item => item.id == wkOption.value))}
                size="small"
                clearIcon={false}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Workspace:"
                    />
                )}
                getOptionDisabled={(option) =>
                    workspaceDefault.findIndex(defaultWk => defaultWk.value === option.value) !== -1
                }
                renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
                    <Chip
                        sx={{backgroundColor: '#43A1A2', color: 'white'}}
                        label={option.label}
                        {...getTagProps({ index })}
                        disabled={workspaceDefault.findIndex(defaultWk => defaultWk.value === option.value) !== -1}
                    />
                ))}
            />
        </div>
    )
}
