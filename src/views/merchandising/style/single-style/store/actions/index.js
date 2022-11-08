
import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import moment from 'moment';
import { fileProgressAction } from '../../../../../../redux/actions/file-progress';
import { merchandisingApi } from '../../../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../../../utility/custom/ConfirmDialog';
import { baseUrl, confirmObj, status } from '../../../../../../utility/enums';
import { convertQueryString, randomIdGenerator } from '../../../../../../utility/Utils';
import { getFabricSubGroupDropdown } from '../../../../../inventory/item-sub-group/store/actions';
import { singleStyleModel } from '../../../model';
import { ADD_SINGLE_STYLE, DELETE_SINGLE_STYLE, DELETE_SINGLE_STYLES_BY_RANGE, DELETE_SINGLE_STYLE_FILE, DROP_DOWN_SINGLE_STYLES, GET_SINGLE_STYLES, GET_SINGLE_STYLES_BY_QUERY, GET_SINGLE_STYLE_BY_ID, GET_SINGLE_STYLE_COLORS, GET_SINGLE_STYLE_SIZES, GET_SINGLE_STYLE_SIZE_GROUPS, GET_SINGLE_TEMPLATE_DROPDOWN, IS_FILE_UPLOADED_COMPLETE, IS_PHOTO_UPLOADED_COMPLETE, IS_SINGLE_STYLE_DATA_LOADED, IS_SINGLE_STYLE_DATA_PROGRESS, IS_SINGLE_STYLE_DATA_SUBMIT_PROGRESS, OPEN_SINGLE_STYLE_FORM, SELECTED_SINGLE_STYLE_NULL, SINGLE_STYLE_DATA_BIND, SINGLE_STYLE_FILE_DOWNLOAD, UPDATE_SINGLE_STYLE } from '../action-types';
/* eslint-disable no-var */

export const singleStyleDataLoad = () => ( dispatch, getState ) => {
    const { isSingleStyleDataLoaded } = getState().styles;
    dispatch( {
        type: IS_SINGLE_STYLE_DATA_LOADED,
        isSingleStyleDataLoaded: !isSingleStyleDataLoaded
    } );
};

export const singleStyleDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SINGLE_STYLE_DATA_PROGRESS,
        isSingleStyleDataProgress: condition
    } );
};
export const singleStyleDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SINGLE_STYLE_DATA_SUBMIT_PROGRESS,
        isSingleStyleDataSubmitProgress: condition
    } );
};


/// Get All wtihout Query
export const getAllStyless = () => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.get_styles}` )
        .then( response => {
            dispatch( {
                type: GET_SINGLE_STYLES,
                styles: response.data
            } );
        } );
};

/// Get All wtihout Query
export const getDropDownStyles = () => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.get_styles}` )
        .then( response => {
            const dropDownData = response?.data?.data.map( i => ( {
                value: i.id,
                label: i.styleNo
            } ) );
            dispatch( {
                type: DROP_DOWN_SINGLE_STYLES,
                dropDownStyles: dropDownData
            } );
        } );
};


//Get Data by Query
export const getStylesByQuery = ( params, queryData ) => async dispatch => {
    dispatch( singleStyleDataLoad() );
    await baseAxios.post( `${merchandisingApi.style.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_SINGLE_STYLES_BY_QUERY,
                    styles: response.data.data,
                    totalPages: response.data.totalRecords,
                    params,
                    queryObj: queryData
                } );
                dispatch( singleStyleDataLoad() );

            }

        } ).catch( ( ( { response } ) => {
            dispatch( singleStyleDataLoad() );
            if ( response?.status === status.badRequest ) {
                notify( 'error', `${response?.data.errors.join( ', ' )}` );
            }
            if ( response?.status === status.notFound || response?.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response?.status === status.conflict ) {
                notify( 'warning', `${response?.statusText}` );
            }
        } ) );
};


// export const bindStyleBasicInfo = style => async dispatch => {
//     await dispatch( {
//         type: GET_SINGLE_STYLE_BY_ID,
//         selectedStyle: style
//     } );
// };

export const bindStyleBasicInfo = singleStyleBasicInfo => async dispatch => {
    await dispatch( {
        type: SINGLE_STYLE_DATA_BIND,
        singleStyleBasicInfo
    } );

    // dispatch( bindItemGroupSegmentWithValueInput( [] ) );

};

/// Selected State Null After Edit or Cancel State Null
export const selectedStyleNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_SINGLE_STYLE_NULL,
            selectedStyle: null
        } );
    };
};

//GET SINGLE STYLE SIZES
export const getSingleStyleSizes = ( styleId ) => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${styleId}/sizes` )
        .then( response => {
            dispatch( {
                type: GET_SINGLE_STYLE_SIZES,
                singleStyleSizes: response.data
            } );
        } );
};
//GET SINGLE STYLE Colors
export const getSingleStyleColors = ( styleId ) => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${styleId}/colors` )
        .then( response => {
            dispatch( {
                type: GET_SINGLE_STYLE_COLORS,
                singleStyleColors: response.data
            } );
        } );
};
export const getSingleStyleColorsDropdown = ( styleId ) => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${styleId}/colors` )
        .then( response => {
            const colorsDropdown = response?.data.map( color => ( {
                value: color.id,
                label: color.name
            } ) );
            dispatch( {
                type: GET_SINGLE_STYLE_COLORS,
                singleStyleColors: colorsDropdown
            } );
        } );
};
//GET SINGLE STYLE SIZES Groups
export const getSingleStyleSizeGroups = ( styleId ) => async dispatch => {
    if ( styleId ) {
        await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${styleId}/sizeGroups` )
            .then( response => {
                console.log( response );
                dispatch( {
                    type: GET_SINGLE_STYLE_SIZE_GROUPS,
                    singleStyleSizeGroups: response?.data?.map( ssg => ( {
                        value: ssg.id,
                        label: ssg.name
                    } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_SINGLE_STYLE_SIZE_GROUPS,
            singleStyleSizeGroups: []
        } );
    }

};


export const handleOpenStyleForm = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SINGLE_STYLE_FORM,
            openStyleForm: condition
        } );
    };
};


// ** Add new Style
export const addStyle = ( style, push ) => async ( dispatch, getState ) => {
    dispatch( singleStyleDataProgress( true ) );
    await baseAxios
        .post( `${merchandisingApi.style.root}`, style )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SINGLE_STYLE,
                    lastStyleId: response.data,
                    style
                } );
                notify( 'success', 'The style has been added Successfully!' );
                // const styleId = response.data;
                // getStyleById( styleId );
                push( { pathname: `/single-style-details`, state: response.data } );

            }
        } )
        .catch( ( { response } ) => {
            dispatch( singleStyleDataProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.conflict ) {
                notify( 'warning', `${response.data.detail}` );
            } else if ( response.status === status.badRequest ) {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


// ** Delete Style
export const deleteStyle = style => async ( dispatch, getState ) => {
    confirmDialog( { ...confirmObj, text: `<h4 class="text-primary mb-0">${style.styleNo}</h4> <br/> <span>You won't retrieve again!</span>` } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( singleStyleDataProgress( true ) );
            await baseAxios
                .delete( `${merchandisingApi.style.root}/${style.id}` )
                .then( response => {

                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().styles;
                        dispatch( {
                            type: DELETE_SINGLE_STYLE
                        } );
                        notify( 'success', 'The Style has been deleted Successfully!' );
                        dispatch( getStylesByQuery( params, queryObj ) );
                        dispatch( singleStyleDataProgress( false ) );
                    } else {
                        notify( 'error', 'The Style DELETE request has been failed!' );
                    }

                } )
                .catch( ( { response } ) => {
                    dispatch( singleStyleDataProgress( false ) );
                    if ( response?.status === status.severError || response === undefined ) {
                        notify( 'error', `Please contact the support team!!!` );
                    } else if ( response?.status === status.badRequest ) {
                        notify( 'errors', response.data.errors );
                    } else {
                        notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
                    }
                } );
        }
    } );

};
// ** Delete Style
export const retrieveStyle = style => async ( dispatch, getState ) => {
    confirmDialog( { ...confirmObj, text: `The (${style.styleNo}) will be available in active list!` } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( singleStyleDataProgress( true ) );

            await baseAxios
                .put( `${merchandisingApi.style.root}/archiveOrActive/${style.id}` )
                .then( response => {
                    console.log( response );
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().styles;

                        dispatch( {
                            type: DELETE_SINGLE_STYLE
                        } );
                        notify( 'success', 'The Style has been retrieve  Successfully!' );
                        dispatch( getStylesByQuery( params, queryObj ) );
                        dispatch( singleStyleDataProgress( false ) );

                    } else {
                        notify( 'error', 'The Style retrieve request has been failed!' );
                    }

                } )
                .catch( ( { response } ) => {
                    dispatch( singleStyleDataProgress( false ) );
                    if ( response.status === status.severError ) {
                        notify( 'error', `Please contact the support team!!!` );
                    } else {
                        notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                    }
                } );
        }
    } );

};

// Update Style Range Delete
export const deleteRangeStyle = ids => ( dispatch, getState ) => {
    baseAxios
        .delete( `${merchandisingApi.style.delete_styles_by_range}`, { ids } )
        .then( response => {
            dispatch( {
                type: DELETE_SINGLE_STYLES_BY_RANGE
            } );
        } )
        .then( () => {
            notify( 'success', 'Styles has been deleted Successfully!' );
            dispatch( getStylesByQuery( getState().styles.params ) );
            dispatch( getAllStyless() );
        } );
};

export const getUploadedImagesBySingleStyleId = ( styleId ) => async ( dispatch, getState ) => {
    const endPoint = `${merchandisingApi.style.root}/${styleId}/images`;
    if ( styleId ) {
        await baseAxios.get( endPoint )
            .then( res => {
                if ( res.status === status.success ) {
                    const { singleStyleBasicInfo } = getState().styles;
                    const images = res.data.sort( ( a, b ) => ( b.isDefault - a.isDefault ) );
                    const img = images.map( i => ( {
                        rowId: randomIdGenerator(),
                        id: i.id,
                        type: "IMAGE",
                        name: i.name,
                        generatedName: i.name,
                        extension: i.extension,
                        isDefault: i.isDefault
                    } )
                    );
                    const imgs = images.map( i => ( {
                        rowId: randomIdGenerator(),
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
                        ...singleStyleBasicInfo,
                        images: img,
                        imagesUrls: imgs
                    };
                    dispatch( bindStyleBasicInfo( updatedObj ) );
                    dispatch( singleStyleDataProgress( false ) );
                }
                // dispatch( {
                //     type: GET_SINGLE_STYLE_UPLOAD_IMAGE,
                //     singleStyleImages: res.data
                // } );
            } ).catch( ( { response } ) => {
                dispatch( singleStyleDataProgress( false ) );
                if ( response === undefined || response?.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response?.data?.errors.join( ', ' )}` );
                }
            } );
    } else {
        const { singleStyleBasicInfo } = getState().styles;

        const updatedObj = {
            ...singleStyleBasicInfo,
            images: [],
            imagesUrls: []
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    }

};


export const singleStylePhotoUpload = ( photoArray ) => async ( dispatch, getState ) => {
    console.log( photoArray );
    const photoUploadUrl = `/api/merchandising/medias/upload/image`;
    // const apiEndPoint = `${merchandisingApi}/imageUpload`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            // console.log( ` ${loaded}kb of ${total}kb | ${percent} % ` );
            dispatch( fileProgressAction( percent ) );
            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
                //console.log( percent );
            }
        }
    };
    for ( let index = 0; index < photoArray.length; index++ ) {
        dispatch( {
            type: IS_PHOTO_UPLOADED_COMPLETE,
            isPhotoUploadComplete: false
        } );

        const formData = new FormData();
        const photoByIndex = photoArray[index].photo;

        formData.append( 'File', photoByIndex );
        formData.append( 'For', 'Style' );

        formData.append( 'IsDefault', photoArray[index].isDefault );
        formData.append( 'Category', '' );
        formData.append( 'Description', '' );

        await baseAxios.post( photoUploadUrl, formData, options )
            .then( response => {
                if ( response.status === status.success ) {
                    console.log( response );
                    const { singleStyleBasicInfo } = getState().styles;

                    const images = {
                        ...response.data,
                        id: 0,
                        rowId: randomIdGenerator()

                    };
                    const updatedObj = {
                        ...singleStyleBasicInfo,
                        images: [...singleStyleBasicInfo.images, images],
                        imagesUrls: [
                            ...singleStyleBasicInfo.imagesUrls, {
                                fileUrl: URL.createObjectURL( photoByIndex ),
                                ...images
                            }
                        ]
                    };
                    dispatch( bindStyleBasicInfo( updatedObj ) );
                    dispatch( {
                        type: IS_PHOTO_UPLOADED_COMPLETE,
                        isPhotoUploadComplete: true
                    } );
                    dispatch( fileProgressAction( 0 ) );
                }

            } ).catch( e => {
                console.log( e );
                dispatch( {
                    type: IS_PHOTO_UPLOADED_COMPLETE,
                    isPhotoUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );

                notify( 'warning', 'Please contact with developer team!' );
            } );
    }
};

export const getUploadedFileBySingleStyleId = ( styleId ) => async ( dispatch, getState ) => {
    const path = `/api/merchandising/styles/${styleId}/files`;
    if ( styleId ) {
        await baseAxios.get( path ).then( response => {
            const { singleStyleBasicInfo } = getState().styles;
            const files = response?.data.map( file => ( {
                rowId: randomIdGenerator(),
                id: file.id,
                category: file.category,
                name: file.name,
                fileUrl: file.fileUrl,
                fileExtension: file.fileExtension,
                uploaded: file.uploaded,
                revisionNo: file.revisionNo
            } ) );
            const fileUrls = response?.data.map( file => ( {
                rowId: randomIdGenerator(),
                id: file.id,
                category: file.category,
                name: file.name,
                fileUrl: `${baseUrl}/${file.fileUrl}`,
                fileExtension: file.fileExtension,
                uploaded: file.uploaded,
                revisionNo: file.revisionNo
            } ) );

            // dispatch( {
            //     type: GET_SINGLE_STYLE_UPLOAD_FILE,
            //     singleStyleFiles: res.data
            // } );
            const updatedObj = {
                ...singleStyleBasicInfo,
                files,
                fileUrls
            };
            dispatch( bindStyleBasicInfo( updatedObj ) );
        } );
    } else {
        const { singleStyleBasicInfo } = getState().styles;
        const updatedObj = {
            ...singleStyleBasicInfo,
            files: [],
            fileUrls: []
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    }

};

export const styleFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
    console.log( 'fileObj', fileObj );
    dispatch( {
        type: IS_FILE_UPLOADED_COMPLETE,
        isFileUploadComplete: false
    } );
    const apiEndPoint = `${merchandisingApi.media.fileUpload}`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            console.log( percent );
            dispatch( fileProgressAction( percent ) );
            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
                //console.log( percent );
            }
        }
    };


    const formData = new FormData();
    for ( var key in fileObj ) {
        formData.append( key, fileObj[key] );
    }

    formData.append( 'File', fileObj.file, fileObj.file.name );
    formData.append( 'For', 'Style' );

    await baseAxios.post( apiEndPoint, formData, options )
        .then( response => {
            if ( response.status === status.success ) {
                const { singleStyleBasicInfo } = getState().styles;

                const fileLength = singleStyleBasicInfo.files.filter( file => file.category === response?.data?.category )?.length;
                const files = {
                    ...response.data,
                    rowId: randomIdGenerator(),
                    id: 0,
                    revisionNo: fileLength

                };

                console.log( fileLength );

                const updatedObj = {
                    ...singleStyleBasicInfo,
                    files: [...singleStyleBasicInfo.files, files],
                    fileUrls: [
                        ...singleStyleBasicInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files,
                            revisionNo: fileLength,
                            fileExtension: files.extension,
                            uploaded: moment( Date().now ).format( 'MM/DD/yyyy hh.mm A' )
                        }
                    ]
                };
                dispatch( bindStyleBasicInfo( updatedObj ) );
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );
            }

        } ).catch( e => {
            console.log( e );
            dispatch( {
                type: IS_FILE_UPLOADED_COMPLETE,
                isFileUploadComplete: true
            } );
            //    dispatch( fileProgressAction( 0 ) );

            notify( 'warning', 'Please contact with Support team!' );
        } );
};

export const singleStyleFileUpload = ( filesObj, lastStyleId ) => async dispatch => {
    // console.log( filesObj, lastStyleId );
    const path = `/api/merchandising/styles/${lastStyleId}/fileUpload`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            //  console.log( ` ${loaded}kb of ${total}kb | ${percent} % ` );
            dispatch( fileProgressAction( percent ) );

            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
                //console.log( percent );
            }
        }
    };
    dispatch( {
        type: IS_FILE_UPLOADED_COMPLETE,
        isFileUploadComplete: false
    } );

    const formData = new FormData();
    for ( const key in filesObj ) {
        formData.append( key, filesObj[key] );
    }
    await baseAxios.post( path, formData, options ).then(
        response => {
            // console.log( response );
            if ( response.status === status.success ) {
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                notify( 'success', 'The file has been uploaded Successfully!' );
                dispatch( fileProgressAction( 0 ) );

            } else {
                notify( 'error', 'Please check file size and types!' );
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );
            }

        }
    ).catch( e => {
        dispatch( {
            type: IS_FILE_UPLOADED_COMPLETE,
            isFileUploadComplete: true
        } );
        dispatch( fileProgressAction( 0 ) );
        notify( 'warning', 'Please contact with developer team!' );
    } )
        ;
    dispatch( getUploadedFileBySingleStyleId( lastStyleId ) );
};

export const singleStyleFileDelete = ( selectFile ) => async ( dispatch, getState ) => {
    const path = `/api/merchandising/styles/removeMedia/${selectFile.id}`;
    const { singleStyleBasicInfo } = getState().styles;
    const enPoint = `${merchandisingApi.style.root}/${singleStyleBasicInfo?.id}/media/file/${selectFile.id}`;
    if ( selectFile.id === 0 ) {
        const files = singleStyleBasicInfo?.files.filter( file => file.rowId !== selectFile.rowId );
        const fileUrls = singleStyleBasicInfo?.fileUrls.filter( file => file.rowId !== selectFile.rowId );
        const updatedObj = {
            ...singleStyleBasicInfo,
            files,
            fileUrls
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
        //
        notify( 'success', 'Your uploaded File has been removed Successfully!' );

    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: DELETE_SINGLE_STYLE_FILE
                    } );
                    notify( 'success', 'The File has been deleted Successfully!' );
                    const files = singleStyleBasicInfo?.files.filter( file => file.id !== selectFile.id );
                    const fileUrls = singleStyleBasicInfo?.fileUrls.filter( file => file.id !== selectFile.id );
                    const updatedObj = {
                        ...singleStyleBasicInfo,
                        files,
                        fileUrls
                    };
                    dispatch( bindStyleBasicInfo( updatedObj ) );
                } else {
                    notify( 'error', 'The File has been deleted Failed!' );
                }
            } ).catch( e => {
                notify( 'warning', 'Please contact with developer team!' );
            } );
    }

};
export const singleStylePhotoDelete = ( selectImage ) => async ( dispatch, getState ) => {
    const { singleStyleBasicInfo } = getState().styles;
    const enPoint = `${merchandisingApi.style.root}/${singleStyleBasicInfo?.id}/media/image/${selectImage.id}`;
    if ( selectImage.id === 0 ) {
        const images = singleStyleBasicInfo?.images.filter( file => file.rowId !== selectImage.rowId );
        const imagesUrls = singleStyleBasicInfo?.imagesUrls.filter( file => file.rowId !== selectImage.rowId );
        const updatedObj = {
            ...singleStyleBasicInfo,
            images,
            imagesUrls
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
        notify( 'success', 'Your uploaded Photo has been removed Successfully!' );
        //
    } else {
        await baseAxios
            .delete( enPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: DELETE_SINGLE_STYLE_FILE
                    } );
                    notify( 'success', 'The Photo has been deleted Successfully!' );
                    const images = singleStyleBasicInfo?.images.filter( file => file.id !== selectImage.id );
                    const imagesUrls = singleStyleBasicInfo?.imagesUrls.filter( file => file.id !== selectImage.id );
                    const updatedObj = {
                        ...singleStyleBasicInfo,
                        images,
                        imagesUrls
                    };
                    dispatch( bindStyleBasicInfo( updatedObj ) );
                } else {
                    notify( 'error', 'The File has been deleted Failed!' );
                }
            } ).catch( e => {
                notify( 'warning', 'Please contact with developer team!' );
            } );
    }

};

export const downloadSingleStyleFile = ( mediaId, push ) => async dispatch => {
    const endPoint = `${merchandisingApi.style.root}/downloadFile/${mediaId}`;
    const url = `${baseUrl}${merchandisingApi.style.root}/downloadFile/${mediaId}`;
    baseAxios.get( endPoint )
        .then( response => {

            // const reader = new FileReader();

            // reader.onload = function ( e ) {
            //     const data = e.target.result;
            //     console.log( data );

            //     // to be continued...
            // };

            // reader.readAsArrayBuffer( response );

            window.open(
                url,
                '_blank'
            );
        } );
    await dispatch( {
        type: SINGLE_STYLE_FILE_DOWNLOAD
    } );
};


export const styleImageUploadLoading = () => async ( dispatch, getState ) => {
    const { isImageUploading } = getState().buyers;
    dispatch( {
        // type: BUYER_IMAGE_UPLOAD_LOADING,
        isImageUploading: !isImageUploading
    } );

};

export const styleImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( styleImageUploadLoading() );
    const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
    await baseAxios.post( apiEndPoint, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { buyerBasicInfo } = getState().buyers;
                const updatedObj = {
                    ...buyerBasicInfo,
                    photo: file,
                    imageEditUrl: URL.createObjectURL( file ),
                    image: response.data
                };
                //   dispatch( bindBuyerBasicInfo( updatedObj ) );
                dispatch( {
                    // type: BUYER_IMAGE_UPLOAD
                } );
                dispatch( styleImageUploadLoading() );
            }
        } ).catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            dispatch( styleImageUploadLoading() );
        } );
};
// ** Get Style by Id
export const getStyleById = id => async dispatch => {
    if ( id ) {
        dispatch( singleStyleDataProgress( true ) );
        await baseAxios
            .get( `${merchandisingApi.style.get_style_by_id}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    const { data } = response;
                    const getData = {
                        ...data,

                        id: data.id,
                        sysId: data.sysId,
                        buyerId: data.buyerId,
                        buyerName: data.buyerName,
                        buyer: { label: data.buyerName, value: data.buyerId },

                        buyerAgentId: data.buyerAgentId,
                        agentName: data.agentName,
                        agent: data.buyerAgentId ? { label: data.agentName, value: data.buyerAgentId } : null,

                        buyerDepartmentId: data.buyerDepartmentId,
                        buyerDepartmentName: data.buyerDepartment,
                        buyerDepartment: { label: data.buyerDepartment, value: data.buyerDepartmentId },

                        buyerProductDeveloperId: data.buyerProductDeveloperId,
                        buyerProductDeveloperName: data.buyerProductDeveloper,
                        buyerProductDeveloper: { label: data.buyerProductDeveloper, value: data.buyerProductDeveloperId },


                        styleDivisionId: data.styleDivisionId,
                        styleDivisionName: data.styleDivision,
                        styleDivision: { label: data.styleDivision, value: data.styleDivisionId },

                        sampleAssigneeId: data.sampleAssigneeId,
                        sampleAssignee: { label: data?.sampleAssignee, value: data?.sampleAssigneeId },

                        styleDepartmentId: data.styleDepartmentId,
                        styleDepartmentName: data.styleDepartment,
                        styleDepartment: { label: data.styleDepartment, value: data.styleDepartmentId },

                        productCategoryId: data.productCategoryId,
                        productCategoryName: data.productCategory,
                        productCategory: { label: data.productCategory, value: data.productCategoryId },

                        styleCategoryId: data.styleCategoryId,
                        styleCategoryName: data.styleCategory,
                        styleCategory: { label: data.styleCategory, value: data.styleCategoryId },
                        productionProcess: { label: data.productionProcess, value: data.productionProcess },
                        merchandiser: { label: data.merchandiser, value: data.merchandiserId },
                        styleNo: data.styleNo,
                        description: data.description ?? '',
                        styleNumber: data.styleNumber,

                        season: { label: data.season, value: data.season },

                        year: { label: data.year, value: data.year },

                        status: { label: data.status, value: data.status },

                        remarks: data.remarks ?? '',
                        additionalInstruction: data.additionalInstruction ?? '',

                        itemGroup: null,
                        defaultFabCatId: data?.defaultFabCatId,
                        defaultFabSubCatId: data?.defaultFabSubCatId,
                        defaultFabDesc: data?.defaultFabDesc,
                        defaultFabDescValue: data?.defaultFabDesc ? { value: data?.defaultFabDesc, label: data?.defaultFabDesc } : null,
                        defaultFabDescTemplate: data?.defaultFabDescTemp ?? '',

                        itemSubGroup: null,


                        sizeGroups: data.styleSizeGroups.map( sg => ( { value: sg.id, label: sg.name, isExistInPo: sg.isExistInPo, isDeleted: false, isNew: false } ) ),
                        colors: data.styleColors.map( c => ( { value: c.id, label: c.name, isExistInPo: c.isExistInPo, isDeleted: false, isNew: false } ) ),

                        images: [],
                        imagesUrls: [],
                        files: [],
                        fileUrls: []

                    };
                    dispatch( {
                        type: GET_SINGLE_STYLE_BY_ID,
                        singleStyleBasicInfo: response?.data ? getData : null,
                        lastStyleId: null
                    } );

                    dispatch( getUploadedFileBySingleStyleId( id ) );
                    dispatch( getUploadedImagesBySingleStyleId( id ) );

                    dispatch( getFabricSubGroupDropdown() );

                }


            } )
            .catch( ( { response } ) => {
                dispatch( singleStyleDataProgress( false ) );

                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else if ( response.status === status.conflict ) {
                    notify( 'warning', `${response.data.detail}` );
                } else if ( response.status === status.badRequest ) {
                    notify( 'warning', `${response.data.errors.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( singleStyleDataProgress( false ) );

        dispatch( {
            type: GET_SINGLE_STYLE_BY_ID,
            singleStyleBasicInfo: singleStyleModel,
            lastStyleId: null
        } );
    }

};

// Update Style
export const updateStyle = ( id, style ) => async ( dispatch, getState ) => {
    dispatch( singleStyleDataProgress( true ) );

    await baseAxios
        .put( `${merchandisingApi.style.root}/${id}`, style )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_SINGLE_STYLE,
                    style
                } );
                notify( 'success', 'The style has been updated Successfully!' );
                // dispatch( getStylesByQuery( getState().styles.params, [] ) );
                dispatch( getStyleById( id ) );
                // dispatch( singleStyleDataLoad( false ) );

            }
        } )
        .catch( ( { response } ) => {
            dispatch( singleStyleDataLoad( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.conflict ) {
                notify( 'warning', `${response.data.detail}` );
            } else if ( response.status === status.badRequest ) {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


export const getSingleStyleDefaultTemplateDropdown = () => dispatch => {
    const apiEnd = `${merchandisingApi.style.root}/defaultFabrics`;
    dispatch( {
        type: GET_SINGLE_TEMPLATE_DROPDOWN,
        singleStyleTemplateDropdown: [],
        isSingleStyleTemplateDropdownLoaded: false
    } );
    baseAxios.get( apiEnd )
        .then( response => {
            if ( response.status === status.success ) {
                const singleStyleTemplateDropdown = response.data?.map( template => (
                    {
                        ...template,
                        value: template.fabricDescription,
                        label: template.fabricDescription
                    }
                ) );
                dispatch( {
                    type: GET_SINGLE_TEMPLATE_DROPDOWN,
                    singleStyleTemplateDropdown,
                    isSingleStyleTemplateDropdownLoaded: true
                } );
            }

        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_SINGLE_TEMPLATE_DROPDOWN,
                singleStyleTemplateDropdown: [],
                isSingleStyleTemplateDropdownLoaded: true
            } );
            if ( response === undefined || response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response?.data?.errors.join( ', ' )}` );
            }
        } );

};