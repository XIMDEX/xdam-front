
import React, { useState, useEffect } from "react";
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MainService from '../../api/service';
import LazyImage from './LazyImage';
import ListResource from './ListResource';
import { useDispatch } from "react-redux";
import { setUser, reloadCatalogue } from "../../appSlice";
import Dialogs from "./Modals/Dialogs";
import { render } from "../../utils/render";

import { Icon } from 'semantic-ui-react'
import { DOCUMENT, MULTIMEDIA } from "../../constants";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      cursor: 'pointer',
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.1),
    },
    chipContainer: {
        height: 55,
        overflow: 'overlay',
        display: 'flex'
    },
    blur: {
        filter: 'blur(2px)',
        pointerEvents: 'none'
    }
  }),
);

export function Resource( { data, listMode, resourceType } ) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [res, setRes] = useState(null)
    const [action, setAction] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(null)
    const [blured, setBlur] = useState(false)
    const [focusedDom, setFocusedDom] = useState(null)

    const preview = render(data)

    function truncate(string, length = 150)
    {
        if (typeof string === 'string') {
            if (string.length > length) {
                return string.slice(0, (length + 2)) + '...'
            } else {
                return string
            }
        } else {
            console.warn('Name must be faceted')
            return 'NO NAME'
        }
    }

    function edit (e) {
        e.stopPropagation();
        setAction('edit')
        setRes(data)
        setDialogOpen(true)
    }

    function itemView (e) {
        e.stopPropagation();
        setAction('view')
        setRes(data)
        setDialogOpen(true)
    }

    function is_logged_to_kakuma() {
        return MainService().isLoggedToKakuma();
    }

    async function get_course_enrollments_endpoint(data) {
        if (data.type !== "course")
            return 0;

        let res = await MainService().getCourseEnrollments(data.id)
        if (res.ok) {
            let resData = await res.json();
            return resData.data.length;
        }
        throw new Error('Error 1.1: On getting course enrollments')
    }

    async function login_kakuma() {
        let res = await MainService().loginTokakuma();

        if (res.ok) {
            let resData = await res.json();
            return resData.kakuma_token;
        }
        throw new Error('Error 1.1: On logging into Kakuma')
    }

    async function remove_endpoint(data) {
        let res = await MainService().removeResource(data.id)
        if(res.ok) {
            let updatedUser = await MainService().getUser();
            dispatch(setUser(updatedUser));
            dispatch(reloadCatalogue());
            return true
        }
        throw new Error('Error 1.1: On remove resource')
    }

    async function remove_course_enrollments_endpoint(data) {
        let res = await MainService().removeCourseEnrollments(data.id)
        if (res.ok) {
            let updatedUser = await MainService().getUser();
            dispatch(setUser(updatedUser));
            dispatch(reloadCatalogue());
            return true;
        }
        throw new Error('Error 1.1: On remove course enrollments')
    }

    async function remove (e) {
        setBlur(true)
        e.stopPropagation();
        let yes = window.confirm('This resource will be permanently deleted, are you sure?');
        if (yes) {
            if (resourceType === 'course') {
                if (!is_logged_to_kakuma()) {
                    let kakumaLogin = await login_kakuma();
                    MainService().setToken('JWT_Kakuma', kakumaLogin);
                }
                let enrollmentsRes = await get_course_enrollments_endpoint(data);
                if (enrollmentsRes > 0) {
                    let enrollmentsYes = window.confirm(`There are ${enrollmentsRes} users enrolled in this course. Are you sure you want to remove it?`);
                    if (enrollmentsYes) {
                        let removeEnrollmentsRes = await remove_course_enrollments_endpoint(data);
                        if (!removeEnrollmentsRes) {
                            alert("Error unenrolling users")
                            setBlur(false);
                            return
                        }
                    }
                }
            }
            await remove_endpoint(data);
        }
        setBlur(false)
    }

    const RCard = () => {
        const name = resourceType === MULTIMEDIA 
            ? 'multimedia' 
            : resourceType === DOCUMENT 
                ? data.data.description.category 
                : resourceType;
        return (
            <div className={`dam-item ${blured ? classes.blur : null}`}  onClick={itemView}>
                <div className="dam-type">{name}</div>
                <div className="dam-preview">
                    <div className="dam-preview-img">
                        <LazyImage
                            src={(data.type == 'document' && data?.data?.description?.image) || preview}
                            alt='lazy_img'
                            grid
                        />
                    </div>
                    <div className="dam-preview-title" title={data.name || data.data.description.course_title}>
                        <strong>{data.name || data.data.description.course_title ||
                             data.data.description.title || 'no name set'} </strong>
                    </div>
                </div>
                <div className="dam-item-actions ">

                    <button className="xdam-btn-primary bg-primary group" title="Edit" onClick={edit}>
                        <Icon name='edit' />
                    </button>

                    <button className="xdam-btn-primary bg-primary group" title="Delete"  onClick={remove}>
                        <Icon name='trash' />
                    </button>
                </div>
            </div>
        )
    }

    const RList = () => {
        return (
            <div className={`${classes.root} ${blured ? classes.blur : null}`} onClick={itemView} >
                <ListResource
                    style={{pointerEvents: 'none'}}
                    truncate={truncate}
                    data={data}
                    preview={preview}
                    edit={edit}
                    remove={remove}
                    itemView={itemView}
                />
            </div>
        )
    }

    return (
        <>
            {
                listMode ? (<RList />) : (<RCard />)
            }
            {
                action && res ? (
                    <Dialogs
                        resourceType={resourceType}
                        action={action}
                        dialogOpen={dialogOpen}
                        resourceData={res}
                        setDialogOpen={setDialogOpen}
                    />
                ) : null
            }
        </>
    );
}
