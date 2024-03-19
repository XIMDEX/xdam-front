import React,{useState} from 'react'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { faPlusCircle, faCheckCircle, faXmarkCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { selectResources, selectWorkspacesData, setResources, setWorkspacesData } from "../../../appSlice";
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

export default function WorkspaceSelect({resourceData, dataForUpdate}) {
    const classes = useStyles();
    const workspaces = useSelector(selectWorkspacesData);
    const resources  = useSelector(selectResources)
    const dispatch = useDispatch()
    const workspacesList = resources?.find(resource => resource.id === dataForUpdate?.id)?.workspaces ?? [];
    const [addWorkspace,setAddWorkspace] = useState(false);
    const [newWorkspaceValue, setNewWorkspaceValue] = useState("");
    const workspaceDefault = [{
        label: 'Public Workspace',
        value: 25
    }]
    const [workspacesOptions, setWorkspacesOptions] = useState(()=> {
        let workspaceArray = []
        Object.keys(workspaces).map((number, workspace) => {
            let obj = {
                value: Number(workspaces[number].id),
                label: workspaces[number].name,
            }
            workspaceArray.push(obj)
        })
        return workspaceArray
    })
    const setResource = (workspaces) => {
        let resourceIndex = resources.findIndex(obj => obj.id === resourceData.id);
        if (resourceIndex !== -1) {
            let updatedResource = {
                ...resources[resourceIndex],
                workspaces: workspaces.map(workspace => String(workspace))
            };
            let updatedResources = [...resources];
            updatedResources[resourceIndex] = updatedResource;
            dispatch(setResources(updatedResources));
        }
    }
    const MyAutocomplete = () => {
        return (
            <Autocomplete
            className={classes.workspaceSelect}
            multiple
            id="tags-standard"
            options={workspacesOptions}
            onChange={(e,values) => handleWorkspaceSelect (e, values)}
            defaultValue={workspacesOptions.filter((wkOption: IWkoptions) => workspacesList.includes(String(wkOption.value)))}
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
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    disabled={workspaceDefault.findIndex(defaultWk => defaultWk.value === option.value) !== -1}
                />
                ))
            }
            />
        );
    };


    const handleWorkspaceSelect = async (e: React.ChangeEvent<EventTarget>, values: Array<IWkoptions>) => {
        let newWorkspaces = []
        values.forEach(option => {
            let obj = {
                name: option.label,
                id: option.value,
            }
            newWorkspaces.push(obj)
        });
        let data = new FormData();
        data.append('workspaces', JSON.stringify(newWorkspaces))
        setResource(newWorkspaces.map(workspace => workspace.id))
        await MainService().setWorkspaceResource(resourceData.id, data)
    };

    const handleAddWorkspace = async () =>{
        let values = workspacesOptions.filter((wkOption: IWkoptions) => dataForUpdate.workspaces.includes(String(wkOption.value)))
        let newWorkspaces = []
        values.forEach(option => {
            let obj = {
                name: option.label,
                id: option.value
            }
            newWorkspaces.push(obj)
        });
        newWorkspaces.push({
            name: newWorkspaceValue,
            id: -1
        })
        let data = new FormData();
        data.append('workspaces', JSON.stringify(newWorkspaces))

        const res = await MainService().setWorkspaceResource(resourceData.id, data)
        setResource(res.resource.workspaces.map(workspace => String(workspace.id)))
        let workspaceArray = []
        res.resource.workspaces.map(workspace => {
            let obj = {
                label: workspace.name,
                value: Number(workspace.id)
            }
            workspaceArray.push(obj)
        })
        const newValue = res.resource.workspaces[res.resource.workspaces.length - 1]
        const newWorkspace = {
            count: 1,
            selected: false,
            radio: false,
            name: newValue.name,
            canBeEdit: true,
            id: newValue.id
        }
        const workspacesArray = {...workspaces, [newValue.id]: newWorkspace}
        setWorkspacesOptions(workspaceArray)
        dispatch(setWorkspacesData(workspacesArray))
        setAddWorkspace(false)
    }

    return ( <div style={{display: 'flex'}}>
    {addWorkspace
    ?
        <input
            autoFocus={true}
            name='New Workspace'
            type="text"
            placeholder="New workspace"
            defaultValue={newWorkspaceValue}
            onChange={(event) => {
                setNewWorkspaceValue(event.target.value)}
            }
            className={classes.addWorkspaceInput}
        />
    :
        (dataForUpdate !== null
        ?
            <MyAutocomplete/>
        :
            (null)
        )
   }
    <div className={classes.workspacesActions}>
    {addWorkspace ?
        <>
            <button
                className={classes.buttonAddWorkspace}
                onClick={handleAddWorkspace}
                disabled={newWorkspaceValue === ""}
            >
                <FontAwesomeIcon
                    style={{cursor: 'pointer'}}
                    size='2x'
                    icon={faCheckCircle}
                    title="Add new workspace" />
            </button>
            <button
                className={classes.buttonAddWorkspace}
                onClick={() => {
                    setAddWorkspace(false)
                    setNewWorkspaceValue('')}}
            >
                <FontAwesomeIcon
                    style={{cursor: 'pointer'}}
                    size='2x'
                    icon={faXmarkCircle}
                    title={"Cancel"}
                />
            </button>
        </>
    :
        (dataForUpdate !== null
        ?
            <button
                className={classes.buttonAddWorkspace}
                onClick={() => setAddWorkspace(true)}
            >
            <FontAwesomeIcon
                style={{cursor: 'pointer'}}
                size='2x'
                icon={faPlusCircle}
                title={'Add new workspace'}
            />
            </button>
        :
            (null)
        )
    }
    </div>
    </div>
    )
}
