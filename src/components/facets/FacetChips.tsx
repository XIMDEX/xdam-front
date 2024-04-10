import React from "react";
import { useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import { selectWorkspacesData } from "../../appSlice";
import { WORKSPACES } from "../../constants";

type FacetValues = Array<string>;

interface FacetsQuery {
    [facetName: string]: FacetValues
}

const Chip = ({name, value}: {name?: string, value: string}) => {
    const content = !name
        ? value
        : `${name[0].toUpperCase() + name.slice(1)}: ${value}`;

    return (<Label size="tiny" color="teal">{content}</Label>);
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
    const workspaces = useSelector(selectWorkspacesData);

    const chips =  Object.keys(facetsQuery).map((facetName: string, index: number) => {
        return (
            <React.Fragment key={index}>
                <span style={{fontSize: '0.75em', fontWeight: 'bold', marginLeft: 10}}>{`${facetName.toUpperCase()}: `}</span>
                {
                    facetsQuery[facetName].map((value: any, i: number) => {
                        if (facetName === WORKSPACES) {
                            value = workspaces[value].name
                        }
                        return (<Chip key={`chip-${facetName}_${i}`} value={value} />)
                    })
                }
            </React.Fragment>
        )
    });

    return <>{chips}</>;
}

export default FacetChips;
