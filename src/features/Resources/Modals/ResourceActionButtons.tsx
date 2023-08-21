import React, { useState, useEffect } from "react";
import { Button, ButtonGroup} from "@material-ui/core";
import ResourcesActions from "../../../utils/ResourcesService";
import ResourceValidationService from "../../../utils/validation/ResourceValidationService";
import { Alert } from "@material-ui/lab";

const ValidationError = ({ message }: { message: string }) => {
  return (
    <Alert variant="outlined" severity="error" className="mb-2">{message}</Alert>
  );
}

const ResourceActionButton = (
  { index, resource, action, validate, handleError }: { index: number, resource: any, action: any, validate: (resource: any) => Promise<void>, handleError: any }) => {

  return (
    <Button
      key={index}
      color='primary'
      variant='outlined'
      onClick={() => {
        validate(resource.data.description)
          .then(() => {
                if (typeof action.href === 'function') {
                    action.href(resource.id)
                } else {
                    window.open(action.href, "_blank")
                }
          })
          .catch((message) => handleError(message))
      }
    }
    >
      {action.label}
    </Button>
  );
}

function ResourceActionButtons( { resource, theme } ) {

  const [actions, setAction] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setAction(ResourcesActions().getActions({...resource, theme}));
  }, [resource, theme]);

  return (
    <>
        { errorMessage.length > 0  && (
            <ValidationError message={errorMessage} />
        )}
        <ButtonGroup orientation='horizontal' fullWidth id='forms-btn-actions' >
            {Object.keys(actions)
                .filter(action => action !== 'create')
                .map((action, index) => (
                    <ResourceActionButton
                        index={index}
                        resource={resource}
                        action={actions[action]}
                        validate={ResourceValidationService.create(action, resource.type)}
                        handleError={setErrorMessage}
                    />)
                )
            }
        </ButtonGroup>
    </>
  );
}

export default ResourceActionButtons;


