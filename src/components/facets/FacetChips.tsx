import React from "react";
import { useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import { selectWorkspacesData } from "../../appSlice";
import { WORKPSACES } from "../../constants";

type FacetValues = Array<string>;

interface FacetsQuery {
    [facetName: string]: FacetValues
}

const Chip = ({name, value}: {name?: string, value: string}) => {

    const content = !name
        ? value
        : `${name}: ${value}`;
    
    return (<Label>{content}</Label>);
}

const WorkspacesChips = ({ facetValues }: { facetValues: FacetValues}) => {
    const workspaces = useSelector(selectWorkspacesData);

    if (!workspaces) return null;

    const chips = facetValues.map((workspaceId: string) => {
        const workspaceName = workspaces[workspaceId].name;
        return (<Chip key={workspaceId} value={workspaceName} />);
    });

    return <>{chips}</>;
}

const FacetChips = ({facetsQuery}: {facetsQuery: FacetsQuery}) => {

    const chips =  Object.keys(facetsQuery).map((facetName: string, index: number) => {

        if (facetName === WORKPSACES) {
            return <WorkspacesChips key={`${facetName}-${index}`} facetValues={facetsQuery[facetName]} />;
        }

        return facetsQuery[facetName].map((value: any, i: number) => {
            const name = value === 'true' || value === 'false'
                ? facetName
                : null;

            return (<Chip key={i} name={name} value={value} />);
        });


    });

    return <>{chips}</>;
}

export default FacetChips;