import React, {useEffect, useState} from "react";
import Container from "@material-ui/core/Container";
import MainService from "../../api/service";
import { XRow, XRowDetails, XRowContent, XButton, XInput } from '@ximdex/xui-react/material';
import {
    Typography
} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faXmarkCircle, faCheckCircle, faBook } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@material-ui/core/CircularProgress';

const data = {
    "data": [
      {
        "id": 4,
        "name": "Public Workspace",
        "wsp_resource_count": 9,
        "organization_id": 1,
        "type": "public",
        "abilities": [
          {
            "id": 19,
            "name": "read-resource",
            "title": "Read resource workspace #4",
            "entity_id": 4,
            "entity_type": "App\\Models\\Workspace",
            "only_owned": false,
            "options": [],
            "scope": null,
            "created_at": "2024-02-29T08:19:34.000000Z",
            "updated_at": "2024-02-29T08:19:34.000000Z"
          },
          {
            "id": 20,
            "name": "download-resource",
            "title": "Download resource workspace #4",
            "entity_id": 4,
            "entity_type": "App\\Models\\Workspace",
            "only_owned": false,
            "options": [],
            "scope": null,
            "created_at": "2024-02-29T08:19:34.000000Z",
            "updated_at": "2024-02-29T08:19:34.000000Z"
          },
          {
            "id": 21,
            "name": "read-workspace",
            "title": "Read workspace workspace #4",
            "entity_id": 4,
            "entity_type": "App\\Models\\Workspace",
            "only_owned": false,
            "options": [],
            "scope": null,
            "created_at": "2024-02-29T08:19:34.000000Z",
            "updated_at": "2024-02-29T08:19:34.000000Z"
          }
        ]
      }
    ]
  }



function PanelCDN({classes}) {
    const [CDNList, setCDNList] = useState([])
    const [CDNToEdit, setCDNToEdit] = useState(null)
    const [newCDNName, setNewCDNName] = useState("")
    const [isCreatingCDN, setIsCreatingCDN] = useState(false)
    const [loading, setLoading] = useState(false);

    const getCDNs = async () => {
        setCDNList(data.data)
    }

    useEffect(() => {
        getCDNs()
    }, []);

    const changeCDNName = () => {
        alert('Cambiando nombre de CDN')
    }

    const deleteCDN = (CDNId: number) => {
        alert("deleting CDN")
    }

    const createNewCDN = async () => {
        const res = await MainService().createCDN(newCDNName)
        console.log(res);
        alert("Create new CDN")
    }

    return (
        <Container
            className={classes.cdnsContainer}
        >
            <div className={classes.cdnsHeader}>
                <Typography className={classes.cdnsTitle}> CDN PANEL </Typography>
                {!isCreatingCDN ?
                 <XButton
                    onClick={() => setIsCreatingCDN(true)}
                    style={{marginRight: '10px'}}>
                    <FontAwesomeIcon icon={faBook} style={{marginRight: '10px'}}/>
                    NEW CDN
                </XButton>
                :
                    <div className={classes.newCdnContainer}>
                    <XInput
                        style={{margin: '0'}}
                        value={newCDNName}
                        placeholder={'CDN name...'}
                        onChange={(e) => setNewCDNName(e.target.value)}
                        type='search'
                        size="small"
                    />
                    <XButton
                        onClick={() => setIsCreatingCDN(false)}
                        style={{minWidth: '30px', marginLeft: '10px', backgroundColor:'#e13144'}}>
                        <FontAwesomeIcon icon={faXmarkCircle} title="Cancel"/>
                    </XButton>
                    <XButton
                        onClick={createNewCDN}
                        style={{minWidth: '30px', marginLeft: '10px'}}>
                        <FontAwesomeIcon icon={faCheckCircle} title="Create CDN"/>
                    </XButton>
                    </div>
                }
            </div>
            {loading ?
                <CircularProgress size={20}/>
            :
                <>
                    {CDNList.map((cdn, index) =>
                        <XRow
                            key={'row' + index}
                            identifier={cdn.id}
                            isCollapsable={true}
                            labelButtonCollapsable={'CDN Details'}
                            style={{
                                borderTop: index === 0 ? '1px solid #BBBBBB' : '',
                                borderBottom: index === (CDNList.length - 1) ? '1px solid #BBBBBB' : '',
                                background: 'rgb(247, 247, 247)',
                                width: '100%',
                                padding: '1em'
                            }}
                            controls={[
                                { component: <XButton style={{minWidth: '30px', marginRight: '10px'}} onClick={ () => CDNToEdit?.id !== cdn.id ? setCDNToEdit(cdn) : setCDNToEdit(null)} ><FontAwesomeIcon icon={faEdit} size="1x" title="Edit CDN"/></XButton> },
                                { component: <XButton style={{backgroundColor:'#e13144', minWidth: '30px'}} onClick={ () => deleteCDN(cdn.id)}><FontAwesomeIcon icon={faTrash} size="1x" title="Delete CDN"/></XButton> },
                            ]}
                        >
                            <XRowContent key={"XRowContent" + index} style={{display: 'flex', alignItems: 'center'}}>
                                <p style={{marginRight: '10px', marginBottom: 0}}><strong>ID:</strong> {cdn.id}</p>
                                {
                                    CDNToEdit?.id === cdn?.id ?
                                        <>
                                            <XInput
                                                style={{margin: '0'}}
                                                value={CDNToEdit.name}
                                                onChange={(e) => setCDNToEdit((prevState:any) => ({...prevState, name: e.target.value}))}
                                                type='search'
                                                size="small"
                                            />
                                            <XButton
                                                onClick={() => setCDNToEdit(null)}
                                                style={{minWidth: '30px', marginLeft: '10px', backgroundColor:'#e13144'}}>
                                                <FontAwesomeIcon icon={faXmarkCircle} title="Cancel edit"/>
                                            </XButton>
                                            <XButton
                                                onClick={() => changeCDNName()}
                                                style={{minWidth: '30px', marginLeft: '10px'}}>
                                                <FontAwesomeIcon icon={faCheckCircle} title="Confirm edit"/>
                                            </XButton>
                                        </>
                                    :
                                        cdn.name
                                }
                            </XRowContent>
                            <XRowDetails key={"XRowDetails_1" + index}>
                                <p className={classes.cdnsDetails}>
                                    <strong>RESOURCE COUNT: </strong>{cdn.wsp_resource_count }
                                </p>
                            </XRowDetails>
                            <XRowDetails key={"XRowDetails_1" + index}>
                                <p className={classes.cdnsDetails}>
                                    <strong>TYPE: </strong>{cdn.type }
                                </p>
                            </XRowDetails>
                            <XRowDetails key={"XRowDetails_1" + index}>
                                <p className={classes.cdnsDetails}>
                                    <strong>ORGANIZATION ID: </strong>{cdn.organization_id }
                                </p>
                            </XRowDetails>


                            {/* <XRowExtraDetails
                                key={"XRowExtraDetails"}
                                extraDetails={[
                                    {
                                        label: 'Created at',
                                        type: 'text',
                                        value: book.created_at
                                    },
                                    {
                                        label: 'Updated at',
                                        type: 'text',
                                        value: book.updated_at
                                    }
                                ]}

                            /> */}
                        </XRow>
                    )}
                </>
            }
        </Container>
    );
}

export default PanelCDN;
