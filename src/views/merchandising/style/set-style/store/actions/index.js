import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import { fileProgressAction } from '../../../../../../redux/actions/file-progress';
import { merchandisingApi } from '../../../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../../../utility/custom/ConfirmDialog';
import { baseUrl, confirmObj, status } from '../../../../../../utility/enums';
import { convertQueryString, randomIdGenerator } from '../../../../../../utility/Utils';
import { setStyleModel } from '../../../model';
import { ADD_SET_STYLE, CLEAR_ALL_SET_STYLE_STATE, DELETE_SET_STYLE, DELETE_SET_STYLES_BY_RANGE, DELETE_SET_STYLE_FILE, DROP_DOWN_SET_STYLES, DROP_DOWN_STYLE_SIZES, GET_SET_STYLES, GET_SET_STYLES_BY_QUERY, GET_SET_STYLES_COLORS, GET_SET_STYLES_SIZE_GROUPS, GET_SET_STYLE_BY_ID, GET_SET_STYLE_STYLES_BY_SET_STYLE_ID, GET_SET_STYLE_UPLOAD_FILE, GET_SET_STYLE_UPLOAD_IMAGE, IS_SET_FILE_UPLOADED_COMPLETE, IS_SET_PHOTO_UPLOADED_COMPLETE, IS_SET_STYLE_DATA_LOADED, SELECTED_SET_STYLE_NULL, SET_STYLE_DATA_BIND, SET_STYLE_DETAILS_UPDATE, UPDATE_SET_STYLE } from '../action-types';


export const setStyleDataLoad = () => ( dispatch, getState ) => {
    const { isSetStyleDataLoaded } = getState().setStyles;
    dispatch( {
        type: IS_SET_STYLE_DATA_LOADED,
        isSetStyleDataLoaded: !isSetStyleDataLoaded
    } );
};

/// Get All wtihout Query
export const getAllSetStyless = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.setStyle.get_setStyles}` ).then( response => {
            dispatch( {
                type: GET_SET_STYLES,
                setStyles: response.data
            } );
        } );
    };
};


export const getDropDownSetStyles = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.setStyle.get_setStyles_by_query}` ).then( response => {
            console.log( response );
            dispatch( {
                type: DROP_DOWN_SET_STYLES,
                dropdownSetStyleSizeGroups: response.data.data.map( item => ( { value: item.id, label: item.styleNo } ) )
            } );
        } );
    };
};

export const getDropDownSetStyleSizeGroups = ( setStyleId ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.setStyle.root}/${setStyleId}/styles/sizeGroups`;
    await baseAxios.get( apiEndPoint ).then( response => {
        console.log( response );
        dispatch( {
            type: GET_SET_STYLES_SIZE_GROUPS,
            dropdownSetStyleSizeGroups: response.data.map( item => ( { value: item.id, label: item.groupName } ) )
        } );
    } );
};
export const getDropDownSetStyleColors = ( setStyleId ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.setStyle.root}/${setStyleId}/styles/colors`;
    await baseAxios.get( apiEndPoint ).then( response => {
        console.log( response );
        dispatch( {
            type: GET_SET_STYLES_COLORS,
            dropdownSetStyleColors: response.data.map( item => ( { value: item.id, label: item.name } ) )
        } );
    } );
};

export const getStyleSizesDropdownByStyleId = ( styleId ) => async dispatch => {
    console.log( styleId );
    const endPoint = `${merchandisingApi.style.root}/${styleId}/sizes`;
    baseAxios.get( endPoint )
        .then( response => {
            console.log( response?.data );
            const dropdownStyleSizes = response?.data?.map( size => (
                {
                    value: size.id,
                    label: size.name
                }
            ) );
            dispatch( {
                type: DROP_DOWN_STYLE_SIZES,
                dropdownStyleSizes
            } );
        } );
};


//Get Data by Query
export const getSetStylesByQuery = ( params, queryData ) => async dispatch => {
    dispatch( setStyleDataLoad() );
    await baseAxios.post( `${merchandisingApi.setStyle.root}/Grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_SET_STYLES_BY_QUERY,
                    setStyles: response.data.data,
                    totalPages: response.data.totalRecords,
                    params,
                    queryObj: queryData
                } );
                dispatch( setStyleDataLoad() );

            }

        } ).catch( ( ( { response } ) => {
            dispatch( setStyleDataLoad() );
            if ( response.status === status.badRequest ) {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            if ( response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response.status === status.conflict ) {
                notify( 'warning', `${response.statusText}` );
            }
        } ) );
};

//GET Dropdown Data PO Styles
export const getSetStyleStylesDropdownBySetStyleId = ( setStyleId ) => async ( dispatch, getState ) => {
    if ( setStyleId ) {
        const endPoint = `${merchandisingApi.purchaseOrder.root}/setStyle/${setStyleId}/styles`;
        await baseAxios.get( endPoint )
            .then( response => {
                const responseArray = response?.data?.map( i => ( {
                    value: i.styleId,
                    label: i.styleNo
                }
                ) );
                dispatch( {
                    type: GET_SET_STYLE_STYLES_BY_SET_STYLE_ID,
                    setStyleStylesDropdown: response?.data ? responseArray : []
                } );
            } );
    } else {
        dispatch( {
            type: GET_SET_STYLE_STYLES_BY_SET_STYLE_ID,
            setStyleStylesDropdown: []
        } );
    }
};


export const bindSetStyleBasicInfo = ( setStyleBasicInfo ) => async dispatch => {
    await dispatch( {
        type: SET_STYLE_DATA_BIND,
        setStyleBasicInfo
    } );
};


/// Selected State Null After Edit or Cancel State Null
export const selectedSetStyleNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_SET_STYLE_NULL,
            selectedSetStyle: null
        } );
    };
};


// ** Add new  Set Style
export const addSetStyle = ( setStyle, push ) => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.setStyle.add_setStyle}`, setStyle )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_SET_STYLE,
                        lastSetStyleId: response.data,
                        setStyle
                    } );
                    notify( 'success', 'The Set Style has been added Successfully!' );
                    push( `/edit-set-style/${response.data}` );
                } else {
                    notify( 'error ', 'The sSet Style has been added Failed!' );
                }
            } )

            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else if ( response.status === status.conflict ) {
                    notify( 'warning', `${response.data.detail}` );
                } else if ( response.status === status.badRequest ) {
                    notify( 'warning', `${response.data.errors.join( ', ' )}` );
                }
            } );
    };
};

// Update Set Style
export const updateSetStyle = ( setSetStyleId, setStyle ) => async ( dispatch ) => {
    console.log( JSON.stringify( setStyle, null, 2 ) );
    baseAxios
        .put( `${merchandisingApi.setStyle.root}/${setSetStyleId}`, setStyle )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_SET_STYLE,
                    setStyle
                } );
                notify( 'success', 'The Set Style has been updated Successfully!' );
            }
        } )

        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.conflict ) {
                notify( 'warning', `${response.data.detail}` );
            } else if ( response.status === status.badRequest ) {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


// ** Delete SET Style
export const deleteSetStyle = id => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .put( `${merchandisingApi.style.root}/archiveOrActive/${id}` )
                .then( response => {
                    console.log( response );
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().setStyles;
                        dispatch( {
                            type: DELETE_SET_STYLE
                        } );
                        notify( 'success', 'The Set-Style has been deleted Successfully!' );
                        dispatch( getSetStylesByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Set-Style DELETE request has been failed!' );
                    }

                } )
                .catch( err => console.log( err ) );
        }
    } );
};
export const retrieveSetStyle = id => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .put( `${merchandisingApi.style.root}/archiveOrActive/${id}` )
                .then( response => {
                    console.log( response );
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().setStyles;

                        dispatch( {
                            type: DELETE_SET_STYLE
                        } );
                        notify( 'success', 'The Set-Style has been retrieved Successfully!' );
                        dispatch( getSetStylesByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Set-Style retrieved request has been failed!' );
                    }

                } )
                .catch( err => console.log( err ) );
        }
    } );
};

// Update SET Style Range Delete
export const deleteRangeSetStyle = ids => {
    return ( dispatch, getState ) => {
        baseAxios
            .delete( `${merchandisingApi.setStyle.delete_setStyles_by_range}`, { ids } )
            .then( response => {
                dispatch( {
                    type: DELETE_SET_STYLES_BY_RANGE
                } );
            } )
            .then( () => {
                notify( 'success', 'Set Style has been deleted Successfully!' );
                dispatch( getSetStylesByQuery( getState().setStyles.params ) );
                dispatch( getAllSetStyless() );
            } );
    };
};

export const getUploadedImagesBySetStyleId = ( setStyleId ) => async ( dispatch, getState ) => {
    if ( setStyleId ) {
        const endPoint = `${merchandisingApi.setStyle.root}/${setStyleId}/images`;

        await baseAxios.get( endPoint ).then( res => {

            const { setStyleBasicInfo } = getState().setStyles;
            const img = res.data.map( i => ( {
                id: i.id,
                type: "IMAGE",
                name: i.name,
                generatedName: i.name,
                extension: i.extension,
                isDefault: i.isDefault
            } )
            );
            const imgs = res.data.map( i => ( {
                id: i.id,
                type: "IMAGE",
                name: i.name,
                generatedName: i.name,
                extension: i.extension,
                fileUrl: `${baseUrl}/${i.fileUrl}`,
                isDefault: i.isDefault
            } )
            );
            const updatedObj = {
                ...setStyleBasicInfo,
                images: img,
                imagesUrls: imgs
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );


            dispatch( {
                type: GET_SET_STYLE_UPLOAD_IMAGE,
                setStyleImages: res.data
            } );
        } );
    } else {
        dispatch( {
            type: GET_SET_STYLE_UPLOAD_IMAGE,
            setStyleImages: []
        } );
    }
};


export const setStylePhotoUpload = ( photoArray ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.setStyle.root}/imageUpload`;

    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            dispatch( fileProgressAction( percent ) );

            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
            }
        }
    };
    for ( let index = 0; index < photoArray.length; index++ ) {
        dispatch( {
            type: IS_SET_PHOTO_UPLOADED_COMPLETE,
            isSetStylePhotoUploadComplete: false
        } );
        const formData = new FormData();
        const photoByIndex = photoArray[index].photo;
        formData.append( 'File', photoByIndex );
        formData.append( 'IsDefault', photoArray[index].isDefault );
        formData.append( 'Category', '' );
        formData.append( 'Description', '' );

        await baseAxios.post( apiEndPoint, formData, options ).then(
            response => {
                if ( response.status === status.success ) {
                    const { setStyleBasicInfo } = getState().setStyles;
                    const updatedObj = {
                        ...setStyleBasicInfo,
                        images: [...setStyleBasicInfo.images, response.data],
                        imagesUrls: [
                            ...setStyleBasicInfo.imagesUrls, {
                                fileUrl: URL.createObjectURL( photoByIndex ),
                                id: randomIdGenerator(),
                                ...response.data
                            }
                        ]
                    };
                    dispatch( bindSetStyleBasicInfo( updatedObj ) );

                    dispatch( {
                        type: IS_SET_PHOTO_UPLOADED_COMPLETE,
                        isSetStylePhotoUploadComplete: true
                    } );
                    dispatch( fileProgressAction( 0 ) );
                } else {
                    notify( 'error', 'Please check file size and types!' );
                    dispatch( {
                        type: IS_SET_PHOTO_UPLOADED_COMPLETE,
                        isSetStylePhotoUploadComplete: true
                    } );
                    dispatch( fileProgressAction( 0 ) );
                }
                console.log( response );
            }
        ).catch( e => {
            dispatch( {
                type: IS_SET_PHOTO_UPLOADED_COMPLETE,
                isSetStylePhotoUploadComplete: true
            } );
            notify( 'warning', 'Please contact with developer team!' );
            dispatch( fileProgressAction( 0 ) );
        } );
    }

    // dispatch( getUploadedImagesBySetStyleId( lastStyleId ) );
};


export const getUploadedFileBySetStyleId = ( styleId ) => async dispatch => {
    if ( styleId ) {
        const path = `/api/merchandising/setStyles/${styleId}/files`;
        await baseAxios.get( path ).then( res => {
            dispatch( {
                type: GET_SET_STYLE_UPLOAD_FILE,
                setStyleFiles: res.data
            } );
        } );
    } else {
        dispatch( {
            type: GET_SET_STYLE_UPLOAD_FILE,
            setStyleFiles: []
        } );
    }

};

export const setStyleFileUpload = ( filesObj, lastStyleId ) => async dispatch => {
    const setStyleId = '15247394-8e3d-4a62-a8d1-d7914e086353';
    const path = `/api/merchandising/setStyles/${lastStyleId}/fileUpload`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            console.log( ` ${loaded}kb of ${total}kb | ${percent} % ` );
            dispatch( fileProgressAction( percent ) );

            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
                console.log( percent );
            }
        }
    };
    dispatch( {
        type: IS_SET_FILE_UPLOADED_COMPLETE,
        isSetStyleFileUploadComplete: false
    } );

    const formData = new FormData();
    for ( const key in filesObj ) {
        formData.append( key, filesObj[key] );
    }
    await baseAxios.post( path, formData, options ).then(
        response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: IS_SET_FILE_UPLOADED_COMPLETE,
                    isSetStyleFileUploadComplete: true
                } );
                notify( 'success', 'The file has been uploaded Successfully!' );
                dispatch( fileProgressAction( 0 ) );

            } else {
                dispatch( {
                    type: IS_SET_FILE_UPLOADED_COMPLETE,
                    isSetStyleFileUploadComplete: true
                } );
                notify( 'error', 'Please check file size and types!' );
                dispatch( fileProgressAction( 0 ) );

            }

        }
    ).catch( e => {
        dispatch( {
            type: IS_SET_FILE_UPLOADED_COMPLETE,
            isSetStyleFileUploadComplete: true
        } );
        notify( 'warning', 'Please contact with developer team!' );
        dispatch( fileProgressAction( 0 ) );

    } );
    dispatch( getUploadedFileBySetStyleId( lastStyleId ) );
};

export const setStyleFileDelete = ( fileId, setStyleId ) => dispatch => {
    const path = `/api/merchandising/setStyles/removeMedia/${fileId}`;
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( path )
                .then( response => {
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_SET_STYLE_FILE
                        } );
                        notify( 'success', 'The File has been deleted Successfully!' );
                        dispatch( getUploadedFileBySetStyleId( setStyleId ) );
                        dispatch( getUploadedImagesBySetStyleId( setStyleId ) );

                    } else {
                        notify( 'error', 'The File has been deleted Failed!' );
                    }
                } );
        }
    } );

};

export const setStyleDetailsUpdate = ( setStyleDetails, setStyleId ) => async dispatch => {
    await baseAxios
        .put( `${merchandisingApi.setStyle.root}/${setStyleId}/styleDetails`, setStyleDetails )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: SET_STYLE_DETAILS_UPDATE,
                    setStyleDetails
                } );
                notify( 'success', 'The style has been added Successfully!' );

            } else {
                notify( 'error ', 'The style has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => console.log( response ) );
};


// ** Get SET Style by Id
export const getSetStyleById = id => async dispatch => {
    if ( id ) {
        await baseAxios
            .get( `${merchandisingApi.setStyle.root}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {

                    const { data } = response;
                    console.log( data );
                    const colors = data.styleDetails[0];

                    const obj = {
                        ...data,
                        id: data.id,
                        buyerId: data.buyerId,
                        buyerName: data.buyerName,
                        buyer: { label: data.buyerName, value: data.buyerId },

                        buyerAgentId: data.buyerAgentId,
                        agentName: data.agentName,
                        agent: { label: data.agentName, value: data.buyerAgentId },

                        buyerDepartmentId: data.buyerDepartmentId,
                        buyerDepartmentName: data.buyerDepartment,
                        buyerDepartment: { label: data.buyerDepartment, value: data.buyerDepartmentId },

                        buyerProductDeveloperName: data?.buyerProductDeveloper,
                        buyerProductDeveloperId: data.buyerProductDeveloperId,
                        buyerProductDeveloper: { label: data?.buyerProductDeveloper, value: data.buyerProductDeveloperId },

                        styleNo: data.styleNo,

                        season: { label: data.season, value: data.season },

                        year: { label: data.year, value: data.year },
                        isSizeSpecific: data.isSizeSpecific,
                        isColorSpecific: data.isColorSpecific,

                        // sizeGroupId: data.sizeGroupId,
                        // sizeGroupName: data.sizeGroupName,
                        // sizeGroupValue: data.sizeGroupName ? { label: data.sizeGroupName, value: data.sizeGroupId } : null,

                        colorId: data.colorId,
                        colorName: data.color,
                        colors: !data.isColorSpecific ? { label: colors?.color, value: colors.colorId } : null,

                        status: { label: data.status, value: data.status },

                        remarks: data.remarks,
                        description: data.description,

                        additionalInstruction: data.additionalInstruction,

                        styleCombination: data.styleDetails.map( sd => ( {
                            fieldId: randomIdGenerator(),
                            styleId: sd.styleId,
                            styleNo: sd.styleNo,
                            styleValue: sd.styleId ? { label: sd.styleNo, value: sd.styleId } : null,
                            sizeId: sd.sizeId,
                            size: sd.size,
                            sizeValue: sd.sizeId ? { label: sd.size, value: sd.sizeId } : null,
                            colorId: sd.colorId,
                            color: sd.color,
                            colorValue: data.isColorSpecific ? { label: sd.color, value: sd.colorId } : null,
                            quantity: sd.quantity
                        } ) ),
                        images: [],
                        imagesUrls: []

                    };
                    dispatch( {
                        type: GET_SET_STYLE_BY_ID,
                        setStyleBasicInfo: response?.data ? obj : null,
                        lastSetStyleId: null
                    } );
                    dispatch( getUploadedImagesBySetStyleId( id ) );
                    dispatch( getUploadedFileBySetStyleId( id ) );
                }

            } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else if ( response.status === status.conflict ) {
                    notify( 'warning', `${response.data.detail}` );
                } else if ( response.status === status.badRequest ) {
                    notify( 'warning', `${response.data.errors.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( {
            type: GET_SET_STYLE_BY_ID,
            setStyleBasicInfo: setStyleModel,
            lastSetStyleId: null
        } );
    }
};


export const clearAllSetStyleState = () => dispatch => {
    dispatch( {
        type: CLEAR_ALL_SET_STYLE_STATE
    } );
};