import React, { useState, useEffect } from "react";
import { Button, ButtonGroup} from "@material-ui/core";
import ResourcesActions from "../../../utils/ResourcesService";
import ResourceValidationService from "../../../utils/validation/ResourceValidationService";
import { Alert } from "@material-ui/lab";

const ValidationError = (message: string) => {
  return (
    <Alert variant="outlined" severity="error" className="mb-2">{message}</Alert> 
  );
}

function ResourceActionButton(
  { index, resource, action, validate, handleError }: { index: number, resource: any, action: any, validate: (resource: any) => Promise<void>, handleError: any }) {

  return (
    <Button
      key={index}
      color='primary'
      variant='outlined'
      onClick={() => {
        validate(resource.data.description)
          .then(() => window.open(action.href, "_blank"))
          .catch((message) => handleError(message))
      }
    }
    >
      {action.label}
    </Button>
  );
}

function ResourceActionButtons( { resource } ) {

  const [actions, setAction] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {  
    setAction(ResourcesActions().getActions(resource));
  }, []);

  return (
    <>
    { errorMessage.length > 0 && ValidationError(errorMessage) }
    <ButtonGroup orientation='horizontal' fullWidth id='forms-btn-actions' >
      {
        Object.keys(actions)
          .filter(action => action !== 'create')
          .map((action, index) => (
            ResourceActionButton({
              index,
              resource,
              action: actions[action],
              validate: ResourceValidationService.create(action, resource.type),
              handleError: setErrorMessage
            })
          ))
      }
    </ButtonGroup>
    </>
  );
}

export default ResourceActionButtons;


