import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { XInput, XButton, XDropdown, XPopUp, XRow,XRowContent, XRowDetails} from '@ximdex/xui-react/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faGear, faGears } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NewCDNModal from "./NewCDNModal";
import { Loading } from "../Loading/Loading";
import { CircularProgress } from "@material-ui/core";
import AddCollectionModal from "./AddCollectionModal";
import MultipleHashesModal from "./MultipleHashesModal";
import MainService from "../../api/service";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
    },
    headerContainer:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        margin: '4em 0',
        padding: '2em'
    },
    contentContainer: {
        minHeight: '60vh'
    },
    xrow: {
        border: '0',
        borderTop: '1px solid #BBBBBB',
        borderLeft: '1px solid #BBBBBB',
        borderRight: '1px solid #BBBBBB',
        padding: '1em',
        "& > div:nth-child(1)": {
            "& > div:nth-child(3)": {
                "& > div": {
                    display: 'flex',
                    alignItems:'center'
                }
            },
        },
        "& > div:nth-child(2)": {
            "& > div": {
                "& > div:nth-child(2)": {
                    display: 'flex',
                    alignItems:'center'
                }
            },
        },
    },
    xrowContent: {
        display: 'flex',
        alignItems: 'center'
    },
    xrowDetails:{
        padding: '1em',
        display: 'flex'
    }

  }),
);

const StyledGreenXButton = styled(XButton)`
    font-size: 1em;
    min-width: unset;
    width: 2em;
    margin-left: 0.5em;
`;


const StyledRedXButton = styled(StyledGreenXButton)`
    &:hover {
        background: #e13144;
    }
`;


function PanelCDN() {
    const classes = useStyles()
    const [loading, setLoading] = useState(true)
    const [loadingText, setLoadingText] = useState('Loading CDN list')
    const [cdnList, setCDNList] = useState([])
    const [cdnCollection, setCdnCollection] = useState([])
    const [cdnCollectionLoading, setCdnCollectionLoading] = useState([])


    useEffect(() => {
        setCDNList([{
            id: '1',
            name: 'testing cdn 1'
        },
        {
            id: '2',
            name: 'testing cdn 2'
        }
        ])
        setLoading(false)
    }, []);

    const getCDNCollection = async (cdn_id, index) => {
        handleCollectionLoading(index, true)

        // try{
        //     const res = await MainService().getCDNCollectionList(cdn_id)
        //      if (res.created) {
        //          alert('Hashes regenerated successfully')
        //      }
        //  } catch(error) {
        //      alert('Network error, please contact with your proveedor')
        //      console.error(error)
        //  } finally {
        //     handleCollectionLoading(index, true)
        // }
        setCdnCollection([
            [{
                name:'collectiontesting 1',
                id: 'collection id 1',

            },
            {
                name:'collectiontesting 2',
                id: 'collection id 2',

            }
            ],

        ])

        setTimeout(() => {
            handleCollectionLoading(index, false)
        }, 2000);

    }

    const handleCollectionLoading = (index, value) => {
        let cdnCollectionLoadingCopy = [...cdnCollectionLoading]
        cdnCollectionLoadingCopy[index] = value
        setCdnCollectionLoading(cdnCollectionLoadingCopy)
    }

    const regenerateHashesForCollection = async (cdn_id, collection_name, collection_id) => {
        setLoading(true)
        setLoadingText(`Generating hashes for ${collection_name}`)

        try{
            const res = await MainService().generateCollectionResourcesHash(cdn_id, collection_id)
             if (res.created) {
                 alert('Hashes regenerated successfully')
             }
         } catch(error) {
             alert('Network error, please contact with your proveedor')
             console.error(error)
         } finally {
             setLoading(false)
        }
    }

    const removeCollectionFromCDN = async (cdn_id, collection_name, collection_id) => {
        setLoading(true)
        setLoadingText(`Removing ${collection_name}`)

        try{
            const res = await MainService().removeCollectionFromCDN(cdn_id, [collection_id])
             if (res.created) {
                 alert('Collection removed successfully')
             }
         } catch(error) {
             alert('Network error, please contact with your proveedor')
             console.error(error)
         } finally {
             setLoading(false)
        }
    }

    return (
        <Container maxWidth="lg">
            <div className={`${classes.headerContainer} ${classes.layoutContainer}`}>
                <h1 style={{margin: '0'}}>CDN PANEL</h1>
                <NewCDNModal
                    triggerButton = {
                        <XButton
                            title='Create CDN.'
                        >
                            <FontAwesomeIcon icon={faPlus}  size='1x' style={{marginRight: '8px'}}/>
                            CREATE CDN
                        </XButton>
                    }
                />

            </div>
            <div className={`${classes.contentContainer} ${classes.layoutContainer}`}>
                {loading ? <Loading text={loadingText}/>
                :
                <>
                    {cdnList.length === 0 ?
                        <h2>Cdn list is empty, add a new CDN to see something</h2>
                    :
                        <>
                            {cdnList.map((cdn, index) =>
                                    <XRow
                                        className={classes.xrow}
                                        style={{
                                            borderBottom: index === (cdnList.length - 1) ? '1px solid #BBBBBB' : '',
                                            background: 'rgb(247, 247, 247)',
                                            width: '100%'
                                        }}
                                        key={'row' + index}
                                        identifier={cdn.id}
                                        isCollapsable={true}
                                        functionButtonCollapsable={() => getCDNCollection(cdn.id, index)}
                                        labelButtonCollapsable={'Show CDN collections'}
                                        controls={[
                                        {
                                            component:
                                            <AddCollectionModal
                                                cdn={cdn}
                                                triggerButton={
                                                <StyledGreenXButton>
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                        title={'Add collection to cdn'}
                                                />
                                                </StyledGreenXButton>}
                                            />
                                        },
                                        {
                                            component:
                                            <StyledRedXButton
                                                onClick={() => alert('Remove cdn')}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    title={'Remove cdn'}
                                                />
                                            </StyledRedXButton>
                                        },
                                        ]}
                                    >
                                        {/* XRow Content */}
                                        <XRowContent key={"XRowContent" + index}>
                                            <div className={classes.xrowContent}>
                                                <span style={{fontWeight:'bold'}}>Id: {cdn.id}</span>
                                                <div style={{marginLeft:'1em'}}>
                                                    <p style={{ margin: '0'}}>{cdn.name}</p>
                                                </div>
                                            </div>
                                        </XRowContent>
                                        {/* XRow Details */}
                                            {cdnCollectionLoading[index] ?
                                                <XRowDetails
                                                    style={{justifyContent:'center'}}
                                                    key={'XRowDetails_loading'}
                                                >
                                                    <CircularProgress size={'50px'} style={{padding: '10px'}}/>
                                                </XRowDetails>
                                                :
                                                 (cdnCollection[index]?.length) > 0 ?
                                                    <React.Fragment key={'XRowDetails_cdn_collection'}>
                                                    {cdnCollection[index]?.map((cdn_collection, cdn_collection_index) =>
                                                        <XRowDetails
                                                            key={'XRowDetails' + cdn_collection_index}
                                                            controlsDetails={[
                                                            {
                                                                component:
                                                                <StyledGreenXButton
                                                                    onClick={() => regenerateHashesForCollection(cdn.id, cdn_collection.name, cdn_collection.id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faGear} size='1x' title='Re-generate hashes for collection' />
                                                                </StyledGreenXButton>
                                                            },
                                                            {
                                                                component:
                                                                <MultipleHashesModal
                                                                    cdn={cdn}
                                                                    triggerButton={
                                                                        <StyledGreenXButton
                                                                    >
                                                                        <FontAwesomeIcon icon={faGears} size='1x' title='Generate multiple hashes for resources' />
                                                                    </StyledGreenXButton>}
                                                                />

                                                            },
                                                            {
                                                                component:
                                                                <StyledRedXButton
                                                                    onClick={() => removeCollectionFromCDN(cdn.id, cdn_collection.name, cdn_collection.id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} size='1x' title='Remove collection' />
                                                                </StyledRedXButton>
                                                            }
                                                        ]}
                                                        >
                                                            <div className={classes.xrowDetails}>
                                                                <span style={{fontWeight:'bold', marginRight: '8px'}}>Id: {cdn_collection.id}</span>
                                                                <p>{cdn_collection?.name || 'name empty'}</p>
                                                            </div>
                                                        </XRowDetails>
                                                    )}
                                                    </React.Fragment>
                                                :
                                                    <XRowDetails key={'XRowDetails'}>This cdn has not any collection linked</XRowDetails>
                                            }


                                        {/* XRow extra details */}
                                        {/* <XRowExtraDetails
                                            key={"XRowExtraDetails" + index}
                                            extraDetails={[
                                                {
                                                    label: 'Languages',
                                                    type: 'text',
                                                    value: activity?.language_default + (activity?.available_languages?.length > 0 ? ", " + activity?.available_languages?.join(', ') : "")
                                                },
                                                {
                                                    label: 'Created date',
                                                    type: activity?.created_at ? "date" : 'text',
                                                    value: activity?.created_at ?? 'data unavailable'
                                                },
                                                {
                                                    label: 'Last update',
                                                    type: activity?.updated_at ? 'date' : 'text',
                                                    value: activity?.updated_at ?? 'data unavailable'
                                                }
                                            ]}
                                        /> */}
                                    </XRow>
                                )}
                        </>
                    }
                </>

                }
            </div>
        </Container>
    );
}

export default PanelCDN;
