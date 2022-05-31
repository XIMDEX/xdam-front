import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrganization, setOrganization} from '../../../slices/organizationSlice';
import MainService from '../../../api/service';
import { Dropdown } from 'semantic-ui-react'

export default function OrganizationSwitch({ switchOrganizationId }) {
    const [organizations, setOrganizations] = React.useState([]);
    const dispatch = useDispatch();
    
    const organization = useSelector(selectOrganization);

    const changeOrganization = (_, data) => {
        switchOrganizationId(data.value);
        dispatch(setOrganization(data.value));
    };

    useEffect(() => {

        const obtainOrganizations = async () => {
            const response = await MainService().organizations().getOrganizations();
            const organizations = await response.json();
            setOrganizations(organizations.map(organization => ({
                key: organization.id,
                value: organization.id,
                text: organization.name
            })));

            if (organization && organizations.find(option => option.value === organization)) {
                setOrganization(organization);
            }
        }
        
        obtainOrganizations();
    }, [])

    return (
        <Dropdown
            selection
            floating
            button
            defaultValue={organizations[0]?.value}
            options={organizations}
            onChange={changeOrganization}
        />
    );
}
