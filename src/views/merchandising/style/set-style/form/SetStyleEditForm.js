import Spinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/merchandising-core.scss';
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import classnames from 'classnames';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Check, UploadCloud, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import AutoProgress from '../../../../../utility/custom/AutoProgress';
import { selectDocCategory, selectProductionProcess, selectSampleAssignee, selectYear, styleStatus } from "../../../../../utility/enums";
import { createOption, formatDate, getIdFromUrl, isObjEmpty, randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { getCascadeDropDownBuyerAgents } from '../../../buyer-agent/store/actions';
import { getCascadeDropDownBuyerDepartments } from '../../../buyer-department/store/actions';
import { getCascadeDropDownBuyerProductDevelopers } from '../../../buyer-product-developer/store/actions';
import { getDropDownBuyers } from '../../../buyer/store/actions';
import { getDropDownColors } from '../../../color/store/actions';
import { getDropDownSeasons } from '../../../season/store/actions';
import { bindSetStyleBasicInfo, getSetStyleById, getUploadedFileBySetStyleId, getUploadedImagesBySetStyleId, setStyleFileDelete, setStyleFileUpload, setStylePhotoUpload, updateSetStyle } from '../store/actions';
import SetStyleDetailsForEdit from './SetStyleDetailsForEdit';
import SetStyleDocumentTable from './SetStyleDocumentTable';
import SetStylePhoto from "./SetStylePhoto";

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'setStyleList',
        name: 'List',
        link: "/set-styles",
        isActive: false
    },
    {
        id: 'setStyle',
        name: 'Set Style Edit',
        link: "#",
        isActive: true
    }
];

const Label2 = () => (
    <Fragment>
        <span className='switch-icon-left'>
            <Check size={14} />
        </span>
        <span className='switch-icon-right'>
            <X size={14} />
        </span>
    </Fragment>
);

const initialFilesUpload = {
    id: 0,
    name: '',
    type: '',
    file: null,
    uploadDate: '',
    documentCategory: null
};

const SetStyleEditForm = () => {
    const { replace, push } = useHistory();
    const setStyleId = getIdFromUrl();
    const dispatch = useDispatch();
    const {
        setStyleBasicInfo,
        isSetStylePhotoUploadComplete,
        isSetStyleFileUploadComplete,
        setStyleFiles
    } = useSelector( ( { setStyles } ) => setStyles );

    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { dropDownBuyerDepartments } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const { dropDownBuyerAgents } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const { dropDownProductDevelopers } = useSelector( ( { productDevelopers } ) => productDevelopers );

    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );

    const { dropDownColors } = useSelector( ( { colors } ) => colors );


    const [buyer, setBuyer] = useState( null );
    const [buyerDepartment, setBuyerDepartment] = useState( null );
    const [buyerAgent, setBuyerAgent] = useState( null );
    const [buyerProductDeveloper, setBuyerProductDeveloper] = useState( null );

    const [status, setStatus] = useState( null );
    const [sampleAssignee, setSampleAssignee] = useState( null );
    const [productionProcess, setProductionProcess] = useState( null );
    ///For Document Upload
    const [uploadFiles, setUploadFiles] = useState( initialFilesUpload );

    ///For Photo Upload
    const [photos, setPhotos] = useState( [] );


    useEffect( () => {
        dispatch( getDropDownColors() );
    }, [] );

    useEffect( () => {
        dispatch( getSetStyleById( setStyleId ) );

    }, [dispatch, setStyleId] );


    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };

    const handleSeasonDropdownOnFocus = () => {
        dispatch( getDropDownSeasons() );
    };


    //Function for Document Upload Start
    const handleFileUpload = async files => {
        const singleFile = files[0];
        setUploadFiles( {
            ...uploadFiles,
            id: randomIdGenerator(),
            name: singleFile.name,
            type: singleFile.type,
            file: singleFile,
            uploadDate: formatDate( new Date() )
        } );
    };


    const { getRootProps, getInputProps } = useDropzone( {
        accept: 'application/pdf, .pdf, .doc, .docx, .xls, .csv, .xlsx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        maxFiles: 1,
        multiple: false,
        maxSize: 2097152,
        onDrop: ( acceptedFiles, fileRejections ) => {
            if ( acceptedFiles.length ) {
                handleFileUpload( acceptedFiles );
            } else {
                const message = fileRejections[0]?.errors[0]?.message;
                const fileError = fileRejections[0].errors[0].code === "file-too-large";
                if ( fileError ) {
                    notify( 'error', 'File size must be within 2 MB.' );
                } else {
                    notify( 'error', `${message}` );

                }
            }
        }
    } );


    const handlePhotoAddToTable = ( photosFiles ) => {
        //For Show On Table
        const mutedPhotoArray = photosFiles.map( photo => ( {
            id: randomIdGenerator(),
            url: URL.createObjectURL( photo ),
            photoName: photo.name,
            isDefault: false,
            photo
        } ) );
        setPhotos( [...photos, ...mutedPhotoArray] );
    };

    const handleUploadPhotoRemoveFromCarousel = ( generatedName ) => {
        const updatedImage = setStyleBasicInfo.images.filter( img => img.generatedName !== generatedName );
        const updatedImageUrl = setStyleBasicInfo.imagesUrls.filter( img => img.generatedName !== generatedName );
        const updatedObj = {
            ...setStyleBasicInfo,
            images: updatedImage,
            imagesUrls: updatedImageUrl
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handlePhotoUploadToCarousel = () => {
        if ( photos.length > 0 ) {
            dispatch(
                setStylePhotoUpload( photos )
            );
        }
        setPhotos( [] );
    };


    const handlePhotoRemoveFromTable = photoId => {
        const exitPhotos = [...photos];
        exitPhotos.splice(
            exitPhotos.findIndex( value => value.id === photoId ),
            1
        );
        setPhotos( exitPhotos );
    };


    const handleDefaultPhotoOnTable = ( photoId ) => {
        setPhotos(
            photos.map(
                ( photo ) => ( photo.id === photoId ? { ...photo, isDefault: !photo.isDefault } : { ...photo, isDefault: false } )
            )
        );

    };

    const handleDefaultPhotoOnCarousel = ( generatedName ) => {
        const updatedImage = setStyleBasicInfo.images.map( img => {
            if ( generatedName === img.generatedName ) {
                img['isDefault'] = true;
            } else {
                img['isDefault'] = false;
            }
            return img;
        } );
        const updatedImageUrl = setStyleBasicInfo.imagesUrls.map( img => {
            if ( generatedName === img.generatedName ) {
                img['isDefault'] = true;
            } else {
                img['isDefault'] = false;
            }
            return img;
        } );
        const updatedObj = {
            ...setStyleBasicInfo,
            images: updatedImage,
            imagesUrls: updatedImageUrl
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };


    const { register, errors, handleSubmit } = useForm();
    const handleSeasonCreate = ( newValue ) => {
        baseAxios.post( `${merchandisingApi.season.add_season}`, { name: newValue, description: newValue } ).then( res => {
            if ( res.status === status.success ) {
                const newOption = createOption( newValue, res.data );
                // setSeason( newOption );
                // dispatch( getDropDownSeasons() );
                // notify( 'success', 'The Season has been added Successfully!' );
            } else {
                notify( 'error', 'The Season has been added Failed!' );
            }
        } );
    };


    const handleBuyerChange = ( data ) => {
        if ( data ) {
            setBuyer( data );
            dispatch( getCascadeDropDownBuyerDepartments( data.value ) );
            dispatch( getCascadeDropDownBuyerAgents( data.value ) );
            dispatch( getCascadeDropDownBuyerProductDevelopers( data.value ) );
            setBuyerDepartment( null );
            setBuyerAgent( null );
            setBuyerProductDeveloper( null );
        } else {
            setBuyer( null );
            setBuyerDepartment( null );
            setBuyerAgent( null );
            setBuyerProductDeveloper( null );
            dispatch( getCascadeDropDownBuyerDepartments( null ) );
            dispatch( getCascadeDropDownBuyerAgents( null ) );
            dispatch( getCascadeDropDownBuyerProductDevelopers( null ) );
        }
    };


    const handleSizeSpecification = ( e ) => {
        const { checked, name } = e.target;
        const { styleCombination } = setStyleBasicInfo;
        if ( checked ) {
            const updateObj = {
                ...setStyleBasicInfo,
                sizeGroupId: '',
                sizeGroupName: '',
                sizeGroupValue: null,
                [name]: checked
            };
            dispatch( bindSetStyleBasicInfo( updateObj ) );
        } else {
            const updatedData = styleCombination.map( i => ( {
                ...i,
                sizeId: '',
                size: '',
                sizeValue: null

            } ) );
            const updatedObj = {
                ...setStyleBasicInfo,
                [name]: checked,
                styleCombination: updatedData
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
        }
    };

    const handleSizeGroupsDropdown = ( data ) => {
        const updateObj = {
            ...setStyleBasicInfo,
            sizeGroupId: data?.value,
            sizeGroupName: data?.label,
            sizeGroupValue: data
        };
        dispatch( bindSetStyleBasicInfo( updateObj ) );
    };


    const handleColorSpecification = ( e ) => {
        const { checked, name } = e.target;
        const { styleCombination } = setStyleBasicInfo;
        if ( checked ) {
            const updateObj = {
                ...setStyleBasicInfo,
                colorId: '',
                colorName: '',
                colorValue: null,
                colors: null,
                [name]: checked
            };
            dispatch( bindSetStyleBasicInfo( updateObj ) );
        } else {
            const updatedData = styleCombination.map( i => ( {
                ...i,
                colorId: '',
                color: '',
                colorValue: null

            } ) );
            const updatedObj = {
                ...setStyleBasicInfo,
                [name]: checked,
                styleCombination: updatedData
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
        }
    };
    const handleColorDropdownChange = ( data ) => {
        const updateObj = {
            ...setStyleBasicInfo,
            colorId: data?.value,
            colorName: data?.label,
            colorValue: data,
            colors: data
        };
        dispatch( bindSetStyleBasicInfo( updateObj ) );
    };
    const handleCancel = () => {
        replace( '/set-styles' );
        dispatch( getSetStyleById( null ) );
        dispatch( getUploadedImagesBySetStyleId( null ) );
        dispatch( getUploadedFileBySetStyleId( null ) );
    };

    const handleInputOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        const updatedObj = {
            ...setStyleBasicInfo,
            [name]: value
        };

        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleSeasonDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            season: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };
    const handleYearDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            year: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };
    const handleBuyerDropdown = ( data ) => {
        if ( data ) {
            const updatedObj = {
                ...setStyleBasicInfo,
                buyer: data
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
            dispatch( getCascadeDropDownBuyerDepartments( data?.value ) );
            dispatch( getCascadeDropDownBuyerAgents( data?.value ) );
            dispatch( getCascadeDropDownBuyerProductDevelopers( data?.value ) );
        } else {
            const updatedObj = {
                ...setStyleBasicInfo,
                buyer: data,
                agent: null,
                buyerDepartment: null,
                buyerProductDeveloper: null
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
            dispatch( getCascadeDropDownBuyerDepartments( null ) );
            dispatch( getCascadeDropDownBuyerAgents( null ) );
            dispatch( getCascadeDropDownBuyerProductDevelopers( null ) );
        }

    };
    const handleAgentDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            agent: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };
    const handleBuyerDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            buyerDepartment: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };
    const handleBuyerProductDeveloperDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            buyerProductDeveloper: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleStatusDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            status: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleAgentDropdownOnFocus = ( agents ) => {
        if ( !agents.length ) {
            console.log( 'first' );

            dispatch( getCascadeDropDownBuyerAgents( setStyleBasicInfo.buyer?.value ) );
        }

    };

    const handleBuyerDepartmentDropdownOnFocus = ( buyerDepartments ) => {
        if ( !buyerDepartments.length ) {
            dispatch( getCascadeDropDownBuyerDepartments( setStyleBasicInfo.buyer?.value ) );
        }
    };

    const handleProductDeveloperDropdownOnFocus = ( developer ) => {
        if ( !developer.length ) {
            dispatch( getCascadeDropDownBuyerProductDevelopers( setStyleBasicInfo.buyer?.value ) );
        }
    };


    const handleFileRemoveFromTable = ( fileId ) => {
        dispatch( setStyleFileDelete( fileId, setStyleId ) );
    };

    const handleAddFileToTable = () => {
        const obj = {
            category: uploadFiles.documentCategory,
            file: uploadFiles.file
        };

        dispatch( setStyleFileUpload( obj, setStyleId ) );
        setUploadFiles( initialFilesUpload );
    };


    const onSubmit = () => {

        const styleDetailsModified = setStyleBasicInfo?.styleCombination.map( sd => (
            {
                styleId: sd?.styleId,
                styleNo: sd?.styleNo,
                sizeId: !setStyleBasicInfo.isSizeSpecific ? null : sd?.sizeId,
                size: !setStyleBasicInfo.isSizeSpecific ? null : sd?.size,
                colorId: !setStyleBasicInfo.isColorSpecific ? null : sd?.colorId,
                color: !setStyleBasicInfo.isColorSpecific ? null : sd?.color,
                quantity: sd?.quantity
            } ) );


        const obj = {
            buyerId: setStyleBasicInfo?.buyer?.value,
            buyerName: setStyleBasicInfo?.buyer.label,

            agentId: setStyleBasicInfo?.agent?.value,
            agentName: setStyleBasicInfo?.agent?.label,

            buyerDepartmentId: setStyleBasicInfo?.buyerDepartment?.value,
            buyerDepartment: setStyleBasicInfo?.buyerDepartment?.label,

            buyerProductDeveloperId: setStyleBasicInfo?.buyerProductDeveloper?.value,
            buyerProductDeveloper: setStyleBasicInfo?.buyerProductDeveloper.label,

            description: setStyleBasicInfo.description,
            styleNo: setStyleBasicInfo?.styleNo,
            season: setStyleBasicInfo?.season?.label,
            year: setStyleBasicInfo?.year?.label,
            status: setStyleBasicInfo?.status?.label,

            remarks: setStyleBasicInfo?.remarks,

            additionalInstruction: setStyleBasicInfo?.additionalInstruction,
            isSizeSpecific: setStyleBasicInfo?.isSizeSpecific,
            isColorSpecific: setStyleBasicInfo?.isColorSpecific,
            styleDetails: styleDetailsModified,
            images: setStyleBasicInfo?.images
        };

        if ( isObjEmpty( errors ) ) {
            if ( setStyleBasicInfo.isColorSpecific || setStyleBasicInfo.isSizeSpecific ) {
                dispatch( updateSetStyle( setStyleId, obj ) );
            } else {
                notify( 'error', 'Please define at least Size or Color Specification' );
            }
        }

        console.log( JSON.stringify( obj, null, 2 ) );
    };


    const handleAddNew = () => {
        push( '/new-set-style' );
        dispatch( getSetStyleById( null ) );
        dispatch( getUploadedImagesBySetStyleId( null ) );
        dispatch( getUploadedFileBySetStyleId( null ) );
    };


    //   console.log( 'setStyleBasicInfo?.styleCombination', JSON.stringify( setStyleBasicInfo?.styleCombination, null, 2 ) );

    const isLoading = !setStyleBasicInfo.styleNo.length;
    return (
        <div>
            {isLoading ? <Spinner /> : ( <Card className="mt-3">
                {/* <CardHeader>
                    <CardTitle className="text-dark font-weight-bold" tag='h2'>Edit Set Style</CardTitle>
                </CardHeader> */}
                <CardBody>
                    <Form onSubmit={handleSubmit( onSubmit )}>
                        <ActionMenu breadcrumb={breadcrumb} title='Edit Set Style' >
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="primary"
                                    type="submit"
                                >Save</NavLink>
                            </NavItem>

                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="secondary"
                                    onClick={() => { handleCancel(); }}
                                >
                                    Cancel
                                </NavLink>
                            </NavItem>
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="success"
                                    onClick={() => { handleAddNew(); }}                    >
                                    Add New
                                </NavLink>
                            </NavItem>
                        </ActionMenu>
                        <Row >
                            <Col>
                                <div className='divider divider-left'>
                                    <div className='divider-text text-secondary font-weight-bolder '>Set Style Information</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">

                                    <Row >
                                        <Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label  col-div-3-style' for='styleNoId'>SYS ID</Label>
                                                        <Label className='custom-form-colons  col-div-3-style'> : </Label>
                                                        <div className='custom-form-group  col-div-3-style'>
                                                            <Input
                                                                id='styleNo'
                                                                type='text'
                                                                name='styleNo'
                                                                bsSize='sm'
                                                                disabled
                                                                placeholder='Buyer Set Style No'
                                                                innerRef={register( { required: true } )}
                                                                invalid={errors.styleNo && true}
                                                                className={classnames( { 'is-invalid': errors['styleNo'] } )}
                                                                value={setStyleBasicInfo?.sysId}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                            {errors && errors.styleNo && <FormFeedback>Buyer Set Style No is required!</FormFeedback>}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='descriptionId'> Description</Label>
                                                        <Label className='custom-form-colons '> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                id='descriptionId'
                                                                type='text'
                                                                name='description'
                                                                bsSize='sm'
                                                                placeholder='Description'
                                                                innerRef={register( { required: false } )}
                                                                invalid={errors.descriotion && true}
                                                                className={classnames( { 'is-invalid': errors['description'] } )}
                                                                value={setStyleBasicInfo?.description}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />

                                                            {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='seasonId'> Date</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                id='descriptionId'
                                                                type='text'
                                                                name='description'
                                                                bsSize='sm'
                                                                disabled
                                                                placeholder='Description'
                                                                innerRef={register( { required: false } )}
                                                                invalid={errors.descriotion && true}
                                                                className={classnames( { 'is-invalid': errors['description'] } )}
                                                                value={moment( setStyleBasicInfo?.creationDate ).format( 'yy-MM-DD' )}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>


                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label  col-div-3-style' for='styleNoId'> Buyer Style NO</Label>
                                                        <Label className='custom-form-colons  col-div-3-style'> : </Label>
                                                        <div className='custom-form-group  col-div-3-style'>
                                                            <Input
                                                                id='styleNo'
                                                                type='text'
                                                                name='styleNo'
                                                                bsSize='sm'
                                                                placeholder='Buyer Set Style No'
                                                                innerRef={register( { required: true } )}
                                                                invalid={errors.styleNo && true}
                                                                className={classnames( { 'is-invalid': errors['styleNo'] } )}
                                                                value={setStyleBasicInfo?.styleNo}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                            {errors && errors.styleNo && <FormFeedback>Buyer Set Style No is required!</FormFeedback>}
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='seasonId'> Season</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Select
                                                                id='seasonId'
                                                                isSearchable
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={dropDownSeasons}
                                                                classNamePrefix='dropdown'
                                                                className="erp-dropdown-select"
                                                                innerRef={register( { required: true } )}
                                                                onCreateOption={data => { handleSeasonCreate( data ); }}

                                                                // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                                value={setStyleBasicInfo?.season}
                                                                onChange={data => {
                                                                    handleSeasonDropdown( data );
                                                                }}
                                                                onFocus={() => { handleSeasonDropdownOnFocus(); }}

                                                            />
                                                            {errors && errors.season && <FormFeedback>season is required!</FormFeedback>}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='yearId'> Year</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Select
                                                                id='yearId'
                                                                isSearchable
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={selectYear}
                                                                classNamePrefix='dropdown'
                                                                className="erp-dropdown-select"
                                                                innerRef={register( { required: true } )}
                                                                // className={classnames( 'react-select', { 'is-invalid': year === null } )}
                                                                value={setStyleBasicInfo?.year}
                                                                onChange={data => {
                                                                    handleYearDropdown( data );
                                                                }}
                                                            />
                                                            {errors && errors.year && <FormFeedback>Year is required!</FormFeedback>}
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <div className='divider divider-right mt-0'>
                                                        <div className='divider-text text-secondary p-0'> <span>&nbsp;</span></div>
                                                    </div>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyer'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyers}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                                        value={setStyleBasicInfo?.buyer}
                                                                        onChange={data => {
                                                                            handleBuyerDropdown( data );
                                                                        }}
                                                                        onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                                                    />
                                                                    {errors && errors.buyer && <FormFeedback>Buyer No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerDepartmentId'> Department</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerDepartmentId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyerDepartments}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': buyerDepartment === null } )}
                                                                        value={setStyleBasicInfo?.buyerDepartment}
                                                                        onChange={data => {
                                                                            handleBuyerDepartmentDropdown( data );
                                                                        }}
                                                                        onFocus={() => {
                                                                            handleBuyerDepartmentDropdownOnFocus( dropDownBuyerDepartments );
                                                                        }}
                                                                    />
                                                                    {errors && errors.buyerDepartment && <FormFeedback>Buyer Department is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerAgentId'> Buyer Agent</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerAgentId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyerAgents}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': buyerAgent === null } )}
                                                                        value={setStyleBasicInfo?.agent}
                                                                        onChange={data => {
                                                                            handleAgentDropdown( data );
                                                                        }}
                                                                        onFocus={() => {
                                                                            handleAgentDropdownOnFocus( dropDownBuyerAgents );
                                                                        }}
                                                                    />

                                                                    {errors && errors.buyerAgent && <FormFeedback>Buyer Agent is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerProductDeveloperId'> Buyer Prod. Dev.</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerProductDeveloperId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownProductDevelopers}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': buyerProductDeveloper === null } )}
                                                                        value={setStyleBasicInfo?.buyerProductDeveloper}
                                                                        onChange={data => {
                                                                            handleBuyerProductDeveloperDropdown( data );
                                                                        }}
                                                                        onFocus={() => {
                                                                            handleProductDeveloperDropdownOnFocus( dropDownProductDevelopers );
                                                                        }}
                                                                    />
                                                                    {errors && errors.buyerProductDeveloper && <FormFeedback>Description is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='merchandiserId'>Merchandiser</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        isSearchable
                                                                        isClearable
                                                                        isCreatable={false}
                                                                        id='merchandiserId'
                                                                        theme={selectThemeColors}
                                                                        options={[]}
                                                                        classNamePrefix='dropdown'
                                                                        className={classnames( 'erp-dropdown-select' )}
                                                                        innerRef={register( { required: true } )}
                                                                        value={null}
                                                                        onChange={data => {
                                                                            setProductionProcess( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.merchandiser && <FormFeedback>Merchandiser is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>

                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='statusId'>S. Assignee</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        id='assigneeId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectSampleAssignee}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': sampleAssignee === null } )}
                                                                        value={sampleAssignee}
                                                                        onChange={data => {
                                                                            setSampleAssignee( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.sampleAssignee && <FormFeedback>Sample Assignee is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='statusId'>Prod. Process</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <Select
                                                                        isSearchable
                                                                        isClearable
                                                                        id='departmentId'
                                                                        theme={selectThemeColors}
                                                                        options={selectProductionProcess}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': productionProcess === null } )}
                                                                        value={productionProcess}
                                                                        onChange={data => {
                                                                            setProductionProcess( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.productionProcess && <FormFeedback>Production Process is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='statusId'>Status</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        id='status'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={styleStatus}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': status === null } )}
                                                                        value={setStyleBasicInfo?.status}
                                                                        onChange={data => {
                                                                            handleStatusDropdown( data );
                                                                        }}
                                                                    // onCreateOption={data => {
                                                                    //     handleStatusInstantCreate( data );
                                                                    // }}
                                                                    />
                                                                    {errors && errors.status && <FormFeedback>Status No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-6' for='remarksId'>Remarks</Label>
                                                                <Label className='custom-form-colons col-div-6'> : </Label>
                                                                <div className='custom-form-group  col-div-6'>
                                                                    <Input
                                                                        style={{ height: '38px' }}
                                                                        id='remarksId'
                                                                        type='textarea'
                                                                        name='remarks'
                                                                        bsSize='sm'
                                                                        placeholder='Remarks'
                                                                        innerRef={register( { required: false } )}
                                                                        invalid={errors.remarks && true}
                                                                        className={classnames( { 'is-invalid': errors['remarks'] } )}
                                                                        value={setStyleBasicInfo?.remarks}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.remarks && <FormFeedback>Remarks No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-6' for='spInstructionId'>Sp. Instruction</Label>
                                                                <Label className='custom-form-colons  col-div-6'> : </Label>
                                                                <div className='custom-form-group col-div-6 '>
                                                                    <Input
                                                                        style={{ height: '38px' }}
                                                                        id='spInstructionId'
                                                                        type='textarea'
                                                                        bsSize="sm"
                                                                        name='additionalInstruction'
                                                                        placeholder='Special Instruction'
                                                                        innerRef={register( { required: false } )}
                                                                        invalid={errors.specialInstruction && true}
                                                                        className={classnames( { 'is-invalid': errors['specialInstruction'] } )}
                                                                        value={setStyleBasicInfo?.additionalInstruction}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.specialInstruction && <FormFeedback>Special Instruction No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        {/* <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='spInstructionId'>Date</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    {moment( setStyleBasicInfo?.creationDate ).format( 'DD-MM-YYYY / hh:mm:ss' )}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='spInstructionId'>SYS ID</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    {setStyleBasicInfo.sysId}
                                                                </div>
                                                            </div>
                                                        </Col> */}
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <SetStylePhoto
                                                    photoData={setStyleBasicInfo?.imagesUrls ?? []}
                                                    handlePhotoRemove={handleUploadPhotoRemoveFromCarousel}
                                                    handleDefaultPhotoOnCarousel={handleDefaultPhotoOnCarousel}
                                                    handlePhotoAddToTable={handlePhotoAddToTable}
                                                    handlePhotoRemoveFromTable={handlePhotoRemoveFromTable}
                                                    handleDefaultPhotoOnTable={handleDefaultPhotoOnTable}
                                                    photos={photos}
                                                    handlePhotoUploadToCarousel={handlePhotoUploadToCarousel}
                                                />
                                            </div>
                                            <div>
                                                {!isSetStylePhotoUploadComplete &&
                                                    (
                                                        <AutoProgress />
                                                    )
                                                }
                                            </div>
                                        </Col>
                                    </Row>


                                </div>
                            </Col>
                        </Row>
                        <div className='divider divider-left '>
                            <div className='divider-text text-secondary font-weight-bolder'>Set Style Details</div>
                        </div>
                        <div >
                            <Row className="gx-5">
                                <Col xl={12} lg={12} md={12} sm={12} >
                                    <div className="border rounded rounded-3 p-1">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12} >
                                                <Row className="d-flex align-items-center">
                                                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={4} xl={4} >
                                                        <CustomInput
                                                            className="font-weight-bolder"
                                                            type='switch'
                                                            label="Size Specific"
                                                            id='icon-primary'
                                                            inline
                                                            name="isSizeSpecific"
                                                            checked={setStyleBasicInfo.isSizeSpecific}
                                                            onChange={( e ) => { handleSizeSpecification( e ); }}
                                                        />
                                                    </FormGroup>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}  >
                                                        <Row>
                                                            <FormGroup tag={Col}>
                                                                <CustomInput
                                                                    type='switch'
                                                                    className="font-weight-bolder"
                                                                    label="Color Specific"
                                                                    id='colorSpecificId'
                                                                    name="isColorSpecific"
                                                                    inline
                                                                    checked={setStyleBasicInfo.isColorSpecific}
                                                                    onChange={( e ) => { handleColorSpecification( e ); }}
                                                                />
                                                            </FormGroup>

                                                        </Row>
                                                    </Col>


                                                </Row>

                                            </Col>
                                            <Col xl={12} lg={12} md={12} sm={12} >
                                                <SetStyleDetailsForEdit />
                                            </Col>
                                        </Row>

                                    </div>
                                </Col>
                                <Col xl={12}>
                                    <div className='divider divider-left'>
                                        <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                                    </div>
                                    <div className="border rounded rounded-3 p-1">
                                        <Row >
                                            <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='spInstructionId'>Doc. Category</Label>
                                                    <Label className='custom-form-colons  col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6 '>
                                                        <Select
                                                            id='docCategoryId'
                                                            isSearchable
                                                            isClearable
                                                            name='documentCategory'
                                                            theme={selectThemeColors}
                                                            options={selectDocCategory}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: true } )}
                                                            // className={classnames( 'react-select', { 'is-invalid': documentCategory === null } )}
                                                            // value={uploadFiles?.documentCategory}
                                                            value={selectDocCategory.filter( i => i.label === uploadFiles?.documentCategory )}
                                                            onChange={( data ) => { setUploadFiles( { ...uploadFiles, documentCategory: data ? data?.label : null } ); }}
                                                        />
                                                        {errors && errors.documentCategory && <FormFeedback>Document Category is required!</FormFeedback>}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={5} xl={6} xxl={6}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='spInstructionId'>Files</Label>
                                                    <Label className='custom-form-colons  col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6 '>
                                                        <div {...getRootProps()}>
                                                            <InputGroup >
                                                                <Input bsSize="sm" value={uploadFiles.name ? uploadFiles.name : 'Choose Your File'} onChange={e => { e.preventDefault(); }} />
                                                                < input {...getInputProps()} id="uploadId" className='p-0' />
                                                                <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                                                    <Button.Ripple tag={InputGroupText} id="uploadId" className='btn-icon pb-0 pt-0' color='flat-primary'>
                                                                        <UploadCloud size={15} />
                                                                    </Button.Ripple>
                                                                </InputGroupAddon>
                                                                {errors && errors.cm && <FormFeedback>CM is required!</FormFeedback>}
                                                            </InputGroup>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={2} xl={1} xxl={1} className="text-right">
                                                <Button.Ripple
                                                    disabled={( !uploadFiles.name || !uploadFiles.documentCategory )}
                                                    onClick={() => { handleAddFileToTable(); }}
                                                    color='primary'
                                                    size='sm'
                                                    outline
                                                >
                                                    Upload
                                                </Button.Ripple>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                {
                                                    isSetStyleFileUploadComplete ? (
                                                        <SetStyleDocumentTable tableData={setStyleFiles} handleFileRemoveFromTable={handleFileRemoveFromTable} />
                                                    ) : <AutoProgress />
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>

                            </Row>
                        </div>


                    </Form >
                </CardBody >
            </Card >
            )
            }
        </div >
    );
};

export default SetStyleEditForm;
