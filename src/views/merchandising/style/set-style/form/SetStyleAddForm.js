import Avatar from '@components/avatar';
import '@custom-styles/merchandising/merchandising-core.scss';
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { store } from '@store/storeConfig/store';

import classnames from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import { Check, CheckSquare, Plus, Square, Upload, UploadCloud, X, XSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { Button, ButtonGroup, Card, CardBody, Col, CustomInput, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import AutoProgress from '../../../../../utility/custom/AutoProgress';
import { selectDocCategory, selectProductionProcess, selectSampleAssignee, selectYear, status as insertStatus } from "../../../../../utility/enums";
import { createOption, formatDate, isObjEmpty, randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { getCascadeDropDownBuyerAgents } from '../../../buyer-agent/store/actions';
import { getCascadeDropDownBuyerDepartments } from '../../../buyer-department/store/actions';
import { getCascadeDropDownBuyerProductDevelopers } from '../../../buyer-product-developer/store/actions';
// import BuyerAddForm from '../../../buyer/form/BuyerAddForm';
import { getBuyersStyles, getDropDownBuyers, handleOpenBuyerSidebar } from '../../../buyer/store/actions';
import { getDropDownColors, handleOpenColorSidebar } from '../../../color/store/actions';
import { getDropDownSeasons } from '../../../season/store/actions';
import { getDropDownSizeGroups, handleOpenSizeGroupSidebar } from '../../../size-group/store/actions';
import { getStyleDropdownStatus, handleOpenStatusSidebar } from '../../../status/store/actions';
import { addSetStyle, getSetStyleById, getUploadedFileBySetStyleId, getUploadedImagesBySetStyleId, setStyleFileDelete, setStyleFileUpload, setStylePhotoUpload } from '../store/actions';
import SetStyleDetailsAddForm from './SetStyleDetailsAddForm';
import SetStyleDocumentTable from "./SetStyleDocumentTable";
import SetStylePhoto from "./SetStylePhoto";

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
        name: 'Set Style',
        link: "#",
        isActive: true
    }
];
const initialFilesUpload = {
    id: 0,
    name: '',
    type: '',
    file: null,
    uploadDate: '',
    documentCategory: null
};

const SetStyleAddForm = () => {
    const { replace } = useHistory();

    const dispatch = useDispatch();
    const {
        lastSetStyleId,
        isSetStylePhotoUploadComplete,
        isSetStyleFileUploadComplete,
        setStyleFiles,
        setStyleImages } = useSelector( ( { setStyles } ) => setStyles );
    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { dropDownBuyerDepartments } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const { dropDownBuyerAgents } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const { dropDownProductDevelopers } = useSelector( ( { productDevelopers } ) => productDevelopers );

    const [buyerName, setBuyerName] = useState( null );
    const { dropDownBuyers, openBuyerSidebar, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const buyerToggleSidebar = () => store.dispatch( handleOpenBuyerSidebar( !openBuyerSidebar ) );

    const [sizeGroupName, setSizeGroupName] = useState( null );
    const { dropDownSizeGroups, openSizeGroupSidebar } = useSelector( ( { sizeGroups } ) => sizeGroups );
    const sizeGroupToggleSidebar = () => store.dispatch( handleOpenSizeGroupSidebar( !openSizeGroupSidebar ) );

    const [colorName, setColorName] = useState( null );
    const { dropDownColors, openColorSidebar } = useSelector( ( { colors } ) => colors );
    const colorToggleSidebar = () => store.dispatch( handleOpenColorSidebar( !openColorSidebar ) );

    const [statusName, setStatusName] = useState( null );
    const { dropdownStyleStatus, openStatusSidebar } = useSelector( ( { statuses } ) => statuses );
    const statusToggleSidebar = () => store.dispatch( handleOpenStatusSidebar( !openStatusSidebar ) );


    const [season, setSeason] = useState( null );

    const [year, setYear] = useState( null );
    const [buyer, setBuyer] = useState( null );
    const [buyerDepartment, setBuyerDepartment] = useState( null );
    const [buyerAgent, setBuyerAgent] = useState( null );
    const [buyerProductDeveloper, setBuyerProductDeveloper] = useState( null );

    const [status, setStatus] = useState( null );
    const [sampleAssignee, setSampleAssignee] = useState( null );
    const [productionProcess, setProductionProcess] = useState( null );
    ///For Document Upload
    const [filesTable, setFilesTable] = useState( [] );
    const [uploadFiles, setUploadFiles] = useState( initialFilesUpload );

    ///For Photo Upload
    const [photos, setPhotos] = useState( [] );
    const [uploadedPhoto, setUploadedPhoto] = useState( [] );

    /// Color Size Spacification
    const [colorSizeSpecification, setColorSizeSpecification] = useState( {
        colorSpecific: false,
        sizeSpecific: false
    } );

    const [sizeGroups, setSizeGroups] = useState( null );
    const [colors, setColors] = useState( null );
    const [styleCombination, setStyleCombination] = useState( [
        {
            fieldId: randomIdGenerator(),
            styleNo: null,
            size: null,
            color: null,
            quantity: ''
        }
    ] );


    useEffect( () => {
        dispatch( getDropDownSeasons() );
        dispatch( getDropDownBuyers() );
        dispatch( getDropDownSizeGroups() );
        dispatch( getDropDownColors() );
        dispatch( getStyleDropdownStatus() );
    }, [] );

    useEffect( () => {
        dispatch( getUploadedImagesBySetStyleId( lastSetStyleId ) );
        dispatch( getUploadedFileBySetStyleId( lastSetStyleId ) );
    }, [dispatch, lastSetStyleId] );

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


    const handleAddFileToTable = () => {
        const obj = {
            category: uploadFiles.documentCategory,
            file: uploadFiles.file
        };
        dispatch( setStyleFileUpload( obj, lastSetStyleId ) );
        setUploadFiles( initialFilesUpload );
    };

    const handleFileRemoveFromTable = ( fileId ) => {
        dispatch( setStyleFileDelete( fileId, lastSetStyleId ) );
        // const files = [...filesTable];
        // files.splice(
        //     files.findIndex( value => value.id === fileId ), 1 );
        // setFilesTable( files );
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

    const handleSeasonCreate = ( newValue ) => {
        baseAxios.post( `${merchandisingApi.season.add_season}`, { name: newValue, description: newValue } ).then( res => {
            if ( res.status === insertStatus.success ) {
                const newOption = createOption( newValue, res.data );
                setSeason( newOption );
                dispatch( getDropDownSeasons() );
                notify( 'success', 'The Season has been added Successfully!' );
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
            dispatch( getBuyersStyles( data?.value ) );
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

    const handleBuyerInstantCreate = ( inputValue ) => {
        if ( inputValue !== undefined ) {
            setBuyerName( inputValue );
            buyerToggleSidebar();
        }
    };


    const handleBuyerInstantAdd = ( values ) => {
        baseAxios.post( `${merchandisingApi.buyer.add_buyer}`, values ).then(
            response => {
                const newOption = createOption( values.name, response.data );
                setBuyer( newOption );
            }
        );
    };
    //For Size Group Instant Create
    const handleSizeGroupInstantCreate = ( inputValue ) => {
        if ( inputValue !== undefined ) {
            setSizeGroupName( inputValue );
            sizeGroupToggleSidebar();
        }
    };

    const handleSizeGroupInstantAdd = ( values ) => {
        baseAxios.post( `${merchandisingApi.sizeGroup.add_size_group}`, values ).then(
            response => {
                const newOption = createOption( values.name, response.data );
                setSizeGroups( newOption );
            }
        );
    };
    //For Color Instant Create
    const handleColorInstantCreate = ( inputValue ) => {
        if ( inputValue !== undefined ) {
            setColorName( inputValue );
            colorToggleSidebar();
        }
    };

    const handleColorInstantAdd = ( values ) => {
        baseAxios.post( `${merchandisingApi.color.add_color}`, values ).then(
            response => {
                const newOption = createOption( values.name, response.data );
                setColors( newOption );
            }
        );
    };

    //For Status Instant Create
    const handleStatusInstantCreate = ( inputValue ) => {
        if ( inputValue !== undefined ) {
            setStatusName( inputValue );
            statusToggleSidebar();
        }
    };

    const handleStatusInstantAdd = ( values ) => {
        baseAxios.post( `${merchandisingApi.status.add_status}`, values ).then(
            response => {
                const newOption = createOption( values.name, response.data );
                setStatus( newOption );
            }
        );
    };

    const [uploadingPhotos, setUploadingPhotos] = useState( [] );
    const handlePhotoAddToTable = ( photosFiles ) => {
        setUploadingPhotos( [...uploadingPhotos, ...photosFiles] );
        //For Show On Table
        const mutedPhotoArray = photosFiles.map( photo => ( {
            id: randomIdGenerator(),
            url: URL.createObjectURL( photo ),
            photoName: photo.name,
            isDefault: false
        } ) );
        setPhotos( [...photos, ...mutedPhotoArray] );
    };
    const handlePhotoUploadToCarousel = () => {
        if ( uploadingPhotos.length > 0 ) {
            dispatch(
                setStylePhotoUpload( uploadingPhotos, lastSetStyleId )
            );
        }
        ///Clear Uploading Photo after photo Uploaded
        setUploadingPhotos( [] );
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

    const handleUploadPhotoRemoveFromCarousel = ( photoId ) => {
        dispatch( setStyleFileDelete( photoId, lastSetStyleId ) );

        // const exitUploadedPhotos = [...uploadedPhoto];
        // exitUploadedPhotos.splice(
        //     exitUploadedPhotos.findIndex( value => value.id === photoId ),
        //     1
        // );
        // setUploadedPhoto( exitUploadedPhotos );
    };

    const handleDefaultPhotoOnTable = ( photoId ) => {
        setPhotos(
            photos.map(
                ( photo ) => ( photo.id === photoId ? { ...photo, isDefault: true } : { ...photo, isDefault: false } )
            )
        );

    };
    const handleDefaultPhotoOnCarousel = ( photoId ) => {
        setUploadedPhoto(
            uploadedPhoto.map(
                ( photo ) => ( photo.id === photoId ? { ...photo, isDefault: true } : { ...photo, isDefault: false } )
            )
        );
    };

    const { register, errors, handleSubmit } = useForm();


    const onSubmit = ( values ) => {

        const styleDetails = styleCombination.map( sd => (
            {
                styleId: sd.styleNo?.value,
                styleNo: sd.styleNo?.label,
                sizeId: !colorSizeSpecification.sizeSpecific ? null : sd.size?.value,
                size: !colorSizeSpecification.sizeSpecific ? null : sd.size?.label,
                colorId: !colorSizeSpecification.colorSpecific ? colors.value : sd.color?.value,
                color: !colorSizeSpecification.colorSpecific ? colors.label : sd.color?.label,
                quantity: sd.quantity
            } ) );
        const obj = {
            styleNo: values.styleNo,
            season: season?.label,
            year: year?.value,
            buyerId: buyer?.value,
            buyerName: buyer?.label,
            agentId: buyerAgent?.value,
            agentName: buyerAgent?.label,
            buyerProductDeveloperId: buyerProductDeveloper?.value,
            buyerDepartmentId: buyerDepartment?.value,
            buyerDepartment: buyerDepartment?.label,
            remarks: values.remarks,
            additionalInstruction: values.specialInstruction,
            status: status?.label,
            isSizeSpecific: colorSizeSpecification.sizeSpecific,
            isColorSpecific: colorSizeSpecification.colorSpecific,
            styleDetails
        };

        console.log( JSON.stringify( obj, null, 2 ) );

        if ( isObjEmpty( errors ) ) {
            if ( colorSizeSpecification.sizeSpecific || colorSizeSpecification.colorSpecific ) {
                dispatch( addSetStyle( obj ) );
            } else {
                notify( 'error', 'Please define at least Size or Color Specification' );
            }
        }
    };

    const handleSizeSpecification = ( e ) => {
        const { checked } = e.target;
        if ( checked ) {
            setSizeGroups( null );
            setColorSizeSpecification( {
                ...colorSizeSpecification,
                sizeSpecific: checked
            } );
        } else {
            for ( let index = 0; index < styleCombination.length; index++ ) {
                styleCombination[index].size = null;
            }
            setColorSizeSpecification( {
                ...colorSizeSpecification,
                sizeSpecific: checked
            } );
        }
    };
    const handleColorSpecification = ( e ) => {
        const { checked } = e.target;
        if ( checked ) {
            setColors( null );
            setColorSizeSpecification( {
                ...colorSizeSpecification,
                colorSpecific: checked
            } );
        } else {
            for ( let index = 0; index < styleCombination.length; index++ ) {
                styleCombination[index].color = null;
            }
            setColorSizeSpecification( {
                ...colorSizeSpecification,
                colorSpecific: checked
            } );
        }
    };
    const handleCancel = () => {
        replace( '/set-styles' );
        dispatch( getSetStyleById( null ) );
        dispatch( getUploadedImagesBySetStyleId( null ) );
        dispatch( getUploadedFileBySetStyleId( null ) );
    };


    return (
        <div>
            <Card className="p-1 mt-3">
                {/* <CardHeader>
                    <CardTitle className="text-dark font-weight-bold" tag='h2'>New Set Style</CardTitle>
                </CardHeader> */}
                <CardBody>
                    <Form onSubmit={handleSubmit( onSubmit )}>
                        <ActionMenu breadcrumb={breadcrumb} title='New Set Style' >
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="primary"
                                    type="submit"
                                    disabled={!!lastSetStyleId}
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
                        </ActionMenu>
                        <Row>
                            <Col xs='12' sm='12' md='8' lg='8' xl='8'>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Set Style Info</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row >
                                        <FormGroup tag={Col} xs='12' sm='12' md='12' lg='3' xl='3'>
                                            <Label className="text-dark" for='styleNo'>Buyer Set Style No :</Label>
                                            <Input
                                                id='styleNo'
                                                type='text'
                                                name='styleNo'
                                                placeholder='Buyer Set Style No'
                                                innerRef={register( { required: true } )}
                                                invalid={errors.buyerSetStyleNo && true}
                                                className={classnames( { 'is-invalid': errors['styleNo'] } )}
                                            />
                                            {errors && errors.styleNo && <FormFeedback>Buyer Set Style No is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark" for='season'>Season</Label>
                                            <CreatableSelect
                                                id='season'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropDownSeasons}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                onCreateOption={data => { handleSeasonCreate( data ); }}

                                                // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                value={season}
                                                onChange={data => {
                                                    setSeason( data );
                                                }}
                                            />
                                            {errors && errors.season && <FormFeedback>season is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark font-weight-bold" for='year'>Year</Label>
                                            <CreatableSelect
                                                id='year'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={selectYear}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': year === null } )}
                                                value={year}
                                                onChange={data => {
                                                    setYear( data );
                                                }}
                                            />
                                            {errors && errors.year && <FormFeedback>Year is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark font-weight-bold" for='descriptinId'>Description</Label>
                                            <Input
                                                id='descriptinId'
                                                type='text'
                                                name='description'
                                                placeholder='Description'
                                                innerRef={register( { required: false } )}
                                                invalid={errors.descriotion && true}
                                                className={classnames( { 'is-invalid': errors['description'] } )}
                                            />
                                            {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                                        </FormGroup>
                                    </Row>
                                </div>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Buyer Info</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row >
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark font-weight-bold" for='buyer'>Buyer</Label>
                                            <CreatableSelect
                                                id='buyer'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropDownBuyers}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                value={buyer}
                                                onChange={data => {
                                                    handleBuyerChange( data );
                                                }}
                                                onCreateOption={data => {
                                                    handleBuyerInstantCreate( data );
                                                }}
                                            />
                                            {errors && errors.buyer && <FormFeedback>Buyer No is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark font-weight-bold" for='buyerDepartment'>Buyer Department</Label>
                                            <CreatableSelect
                                                id='buyerDepartment'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropDownBuyerDepartments}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': buyerDepartment === null } )}
                                                value={buyerDepartment}
                                                onChange={data => {
                                                    setBuyerDepartment( data );
                                                }}
                                            />
                                            {errors && errors.buyerDepartment && <FormFeedback>Buyer Department is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark font-weight-bold" for='buyerAgent'>Buyer Agent</Label>
                                            <CreatableSelect
                                                id='buyerAgent'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropDownBuyerAgents}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': buyerAgent === null } )}
                                                value={buyerAgent}
                                                onChange={data => {
                                                    setBuyerAgent( data );
                                                }}
                                            />
                                            {errors && errors.buyerAgent && <FormFeedback>Buyer Agent is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='3' className="">
                                            <Label className="text-dark font-weight-bold" for='buyerProductDeveloper'>Buyer Product Developer</Label>
                                            <CreatableSelect
                                                id='buyerProductDeveloper'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropDownProductDevelopers}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': buyerProductDeveloper === null } )}
                                                value={buyerProductDeveloper}
                                                onChange={data => {
                                                    setBuyerProductDeveloper( data );
                                                }}
                                            />
                                            {errors && errors.buyerProductDeveloper && <FormFeedback>Description is required!</FormFeedback>}
                                        </FormGroup>
                                    </Row>
                                </div>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Status , Sample Assignee and Production Process</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row >

                                        <FormGroup tag={Col} lg='4' className="">
                                            <Label className="text-dark font-weight-bold" for='status'>Status</Label>
                                            <CreatableSelect
                                                id='status'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropdownStyleStatus}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': status === null } )}
                                                value={status}
                                                onChange={data => {
                                                    setStatus( data );
                                                }}
                                                onCreateOption={data => {
                                                    handleStatusInstantCreate( data );
                                                }}
                                            />
                                            {errors && errors.status && <FormFeedback>Status No is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='4' className="">
                                            <Label className="text-dark font-weight-bold" for='assigneeId'>Sample Assignee</Label>
                                            <CreatableSelect
                                                id='assigneeId'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={selectSampleAssignee}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': sampleAssignee === null } )}
                                                value={sampleAssignee}
                                                onChange={data => {
                                                    setSampleAssignee( data );
                                                }}
                                            />
                                            {errors && errors.sampleAssignee && <FormFeedback>Sample Assignee is required!</FormFeedback>}
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='4' className="">
                                            <Label className="text-dark font-weight-bold" for='departmentId'>Production Process</Label>
                                            <CreatableSelect
                                                isSearchable
                                                isClearable
                                                id='departmentId'
                                                theme={selectThemeColors}
                                                options={selectProductionProcess}
                                                classNamePrefix='select'
                                                innerRef={register( { required: true } )}
                                                // className={classnames( 'react-select', { 'is-invalid': productionProcess === null } )}
                                                value={productionProcess}
                                                onChange={data => {
                                                    setProductionProcess( data );
                                                }}
                                            />
                                            {errors && errors.productionProcess && <FormFeedback>Production Process is required!</FormFeedback>}
                                        </FormGroup>

                                    </Row>
                                </div>
                            </Col>

                            <Col xl='4' lg='4' md='4' sm='12' >
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Photo</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row >
                                        <FormGroup tag={Col} lg='12' className="">
                                            <SetStylePhoto
                                                photoData={setStyleImages}
                                                handleRemovePhoto={handleUploadPhotoRemoveFromCarousel}
                                                handleDefaultPhotoOnCarousel={handleDefaultPhotoOnCarousel}
                                            />
                                        </FormGroup>
                                        {!isSetStylePhotoUploadComplete &&
                                            (
                                                <FormGroup tag={Col} lg='12' className="">
                                                    <AutoProgress />
                                                </FormGroup>
                                            )
                                        }
                                        <FormGroup tag={Col} lg='12' className="">
                                            {
                                                photos.length > 0 &&
                                                <Table size="sm" responsive bordered>
                                                    <thead className="thead-light text-capitalize">
                                                        <tr>
                                                            <td className="text-center">Photo</td>
                                                            <td >File </td>
                                                            <td className="text-center">Actions</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            photos.map( ( photo ) => (
                                                                <tr key={photo.id}>
                                                                    <td className="text-center"> <Avatar img={photo.url} /></td>
                                                                    <td>{photo.photoName}</td>
                                                                    <td className="text-center">
                                                                        <ButtonGroup >
                                                                            <Button.Ripple id="deleteId" onClick={() => { handlePhotoRemoveFromTable( photo.id ); }} className='btn-icon' color='flat-danger'>
                                                                                <XSquare size={18} />
                                                                            </Button.Ripple>
                                                                            <Button.Ripple id='defaultId' onClick={() => { handleDefaultPhotoOnTable( photo.id ); }} className='btn-icon' color='flat-success'>
                                                                                {
                                                                                    photo.isDefault ? <CheckSquare size={18} /> : <Square color='grey' size={18} />
                                                                                }
                                                                            </Button.Ripple>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            ) )
                                                        }
                                                    </tbody>
                                                </Table>
                                            }
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='6' sm="6" xs="6" className="d-flex justify justify-content-start">
                                            <Dropzone maxSize={2097152} accept=".png, .jpg, .jpeg" onDrop={( acceptedFiles, fileRejections ) => {
                                                if ( acceptedFiles.length ) {
                                                    handlePhotoAddToTable( acceptedFiles );
                                                } else {
                                                    const message = fileRejections[0]?.errors[0]?.message;
                                                    const fileError = fileRejections[0].errors[0].code === "file-too-large";
                                                    if ( fileError ) {
                                                        notify( 'error', 'File size must be within 2 MB.' );
                                                    } else {
                                                        notify( 'error', `${message}` );
                                                    }
                                                }
                                            }}>
                                                {( { getRootProps, getInputProps } ) => (
                                                    <span
                                                        {...getRootProps( { onDrop: event => event.stopPropagation() } )}
                                                    >
                                                        <input disabled={!lastSetStyleId} {...getInputProps()} />
                                                        <Button.Ripple
                                                            outline
                                                            id='change-img'
                                                            tag={Label}
                                                            color='primary'
                                                            size="sm"
                                                            disabled={!lastSetStyleId}
                                                        >
                                                            <Plus size={16} />

                                                        </Button.Ripple>
                                                    </span>
                                                )}
                                            </Dropzone>
                                        </FormGroup>
                                        <FormGroup tag={Col} lg='6' sm="6" xs="6" className="d-flex justify justify-content-end">
                                            <Button.Ripple
                                                onClick={() => { handlePhotoUploadToCarousel(); }}
                                                outline tag={Label}
                                                color='success'
                                                size="sm"
                                                disabled={!lastSetStyleId}
                                            >
                                                <Upload size={16} />
                                            </Button.Ripple>
                                        </FormGroup>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <div className='divider divider-left '>
                            <div className='divider-text text-secondary font-weight-bolder'>Remarks and Special Instructions</div>
                        </div>
                        <div className="border rounded rounded-3 p-1">
                            <Row>

                                <FormGroup tag={Col} lg='6' className="">
                                    <Label className="text-dark font-weight-bold" for='remarksId'>Remarks</Label>
                                    <Input
                                        id='remarksId'
                                        type='textarea'
                                        name='remarks'
                                        placeholder='Remarks'
                                        innerRef={register( { required: false } )}
                                        invalid={errors.remarks && true}
                                        className={classnames( { 'is-invalid': errors['remarks'] } )}
                                    />
                                    {errors && errors.remarks && <FormFeedback>Remarks No is required!</FormFeedback>}
                                </FormGroup>

                                <FormGroup tag={Col} lg='6' className="">
                                    <Label className="text-dark font-weight-bold" for='spInstructionId'>Special Instruction</Label>
                                    <Input
                                        id='spInstructionId'
                                        type='textarea'
                                        name='specialInstruction'
                                        placeholder='Special Instruction'
                                        innerRef={register( { required: false } )}
                                        invalid={errors.specialInstruction && true}
                                        className={classnames( { 'is-invalid': errors['specialInstruction'] } )}
                                    />
                                    {errors && errors.specialInstruction && <FormFeedback>Special Instruction No is required!</FormFeedback>}
                                </FormGroup>
                            </Row>
                        </div>
                        <div className='divider divider-left '>
                            <div className='divider-text text-secondary font-weight-bolder'>Set Style Details</div>
                        </div>
                        <div >
                            <Row className="gx-5">
                                <Col xl='8' lg='8' md='12' sm='12' >
                                    <div className="border rounded rounded-3 p-1">
                                        <SetStyleDetailsAddForm colorSizeData={colorSizeSpecification} styleCombination={styleCombination} setStyleCombination={setStyleCombination} />
                                    </div>

                                </Col>
                                <Col xl='4' lg='4' md='12' sm='12'>

                                    <div className="border rounded rounded-3 p-1">
                                        <div className='divider divider-left '>
                                            <div className='divider-text text-secondary font-weight-bolder'>Size and Color Specific</div>
                                        </div>

                                        <div className='divider divider-left divider-normal'>
                                            <div className='divider-text'>Size Specific</div>
                                        </div>
                                        <Row className="d-flex align-items-center">
                                            <FormGroup tag={Col}  >
                                                <CustomInput
                                                    type='switch'
                                                    label="Size Specific"
                                                    id='icon-primary'
                                                    inline
                                                    name="sizeSpecific"
                                                    checked={colorSizeSpecification.sizeSpecific}
                                                    onChange={( e ) => { handleSizeSpecification( e ); }}
                                                />
                                            </FormGroup>
                                            {/* <FormGroup tag={Col} xs='6' sm='6' md='8' lg='10' xl='10' className="mb-1">
                                                <CreatableSelect
                                                    id='sizeSpecific'
                                                    isDisabled={colorSizeSpecification.sizeSpecific}
                                                    isSearchable
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={dropDownSizeGroups}
                                                    // options={selectSizeGroups}
                                                    classNamePrefix='select'
                                                    value={sizeGroups}
                                                    placeholder="Select Size Group"
                                                    onChange={data => {
                                                        setSizeGroups( data );
                                                    }}
                                                    onCreateOption={data => {
                                                        handleSizeGroupInstantCreate( data );
                                                    }}
                                                />
                                            </FormGroup>
                                            {errors && errors.sizeSpecific && <FormFeedback>Color is required!</FormFeedback>} */}
                                        </Row>
                                        <div className='divider divider-left divider-normal'>
                                            <div className='divider-text'>Color Specific</div>
                                        </div>
                                        <Row className="d-flex align-items-center">
                                            <FormGroup tag={Col} xs='6' sm='6' md='4' lg='2' xl='2' >
                                                <CustomInput
                                                    type='switch'
                                                    label={<Label2 />}
                                                    id='colorSpecificId'
                                                    name="colorSpecific"
                                                    checked={colorSizeSpecification.colorSpecific}
                                                    inline
                                                    onChange={( e ) => handleColorSpecification( e )}
                                                />
                                            </FormGroup>
                                            <FormGroup tag={Col} xs='6' sm='6' md='8' lg='10' xl='10' className="mb-1">

                                                <CreatableSelect
                                                    id='colorSpecific'
                                                    isDisabled={colorSizeSpecification.colorSpecific}
                                                    isSearchable
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    // options={selectColor}
                                                    options={dropDownColors}

                                                    classNamePrefix='select'
                                                    placeholder="Select Color"
                                                    value={colors}
                                                    onChange={data => {
                                                        setColors( data );
                                                    }}
                                                    onCreateOption={data => {
                                                        handleColorInstantCreate( data );
                                                    }}
                                                />
                                            </FormGroup>
                                            {errors && errors.colorSpecific && <FormFeedback>Color is required!</FormFeedback>}
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className='divider divider-left  '>
                            <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                        </div>
                        <div className="border rounded rounded-3 p-1">
                            <Row >

                                <FormGroup tag={Col} lg='5' className="">
                                    <Label className="text-dark font-weight-bold" for='docCategoryId'>Document Category</Label>
                                    <CreatableSelect
                                        id='docCategoryId'
                                        isSearchable
                                        isClearable
                                        name='documentCategory'
                                        theme={selectThemeColors}
                                        options={selectDocCategory}
                                        classNamePrefix='select'
                                        innerRef={register( { required: true } )}
                                        // className={classnames( 'react-select', { 'is-invalid': documentCategory === null } )}
                                        // value={uploadFiles?.documentCategory}
                                        value={selectDocCategory.filter( i => i.label === uploadFiles?.documentCategory )}
                                        onChange={( data ) => { setUploadFiles( { ...uploadFiles, documentCategory: data ? data?.label : null } ); }}
                                    />
                                    {errors && errors.documentCategory && <FormFeedback>Document Category is required!</FormFeedback>}
                                </FormGroup>
                                <FormGroup tag={Col} lg='6' >
                                    <Label>File Upload</Label>

                                    <div {...getRootProps()}>
                                        <InputGroup >
                                            <Input value={uploadFiles.name ? uploadFiles.name : 'Choose Your File'} onChange={e => { e.preventDefault(); }} />
                                            < input {...getInputProps()} id="uploadId" className='p-0' />
                                            <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                                <Button.Ripple tag={InputGroupText} id="uploadId" className='btn-icon' color='flat-primary'>
                                                    <UploadCloud size={15} />
                                                </Button.Ripple>
                                            </InputGroupAddon>
                                            {errors && errors.cm && <FormFeedback>CM is required!</FormFeedback>}
                                        </InputGroup>
                                    </div>
                                </FormGroup>

                                <FormGroup tag={Col} lg={1} className="mt-2 d-flex flex-row-reverse text-nowrap">
                                    <Button.Ripple
                                        disabled={( !uploadFiles.name || !uploadFiles.documentCategory || !lastSetStyleId )}
                                        onClick={() => { handleAddFileToTable(); }}
                                        color='primary'
                                        size='md'
                                        outline
                                    >
                                        Upload
                                    </Button.Ripple>
                                </FormGroup>
                                {/* <FormGroup tag={Col} lg='12' className=" d-flex justify justify-content-end">
                                    <Button.Ripple
                                        disabled={( !uploadFiles.name || !uploadFiles.documentCategory || !lastSetStyleId )}
                                        onClick={() => { handleAddFileToTable(); }}
                                        color='primary'
                                        size='sm'
                                        outline
                                    >
                                        Upload
                                    </Button.Ripple>
                                </FormGroup> */}
                                <FormGroup tag={Col} lg='12' >
                                    {
                                        isSetStyleFileUploadComplete ? (
                                            <SetStyleDocumentTable tableData={setStyleFiles} handleFileRemoveFromTable={handleFileRemoveFromTable} />
                                        ) : <AutoProgress />
                                    }
                                </FormGroup>
                            </Row>
                        </div>
                        {/* <Row>
                            <Col className="d-flex flex-row-reverse">
                                <div className='d-inline-block mb-1 mt-1'>
                                    <Button.Ripple onClick={() => { handleCancel(); }} className="ml-1 " outline color="secondary" size="sm">Back to List</Button.Ripple>
                                    <Button.Ripple type="reset" className="ml-1 " outline color="secondary" size="sm">Reset</Button.Ripple>
                                    <Button.Ripple onClick={() => { handleCancel(); }} className="ml-1 " outline color="danger" size="sm">Cancel</Button.Ripple>
                                    <Button.Ripple disabled={!!lastSetStyleId} className="ml-1" type="submit" outline color="success" size="sm">Submit</Button.Ripple>
                                </div >
                            </Col >
                        </Row > */}
                    </Form >
                </CardBody >
            </Card >
            {/* {
                openBuyerSidebar ? (
                    <BuyerAddForm open={openBuyerSidebar} addInstantCreate={handleBuyerInstantAdd} buyerName={buyerName} toggleSidebar={buyerToggleSidebar} />
                ) : openSizeGroupSidebar ? (
                    <SizeGroupAddForm open={openSizeGroupSidebar} addInstantCreate={handleSizeGroupInstantAdd} sizeGroupName={sizeGroupName} toggleSidebar={sizeGroupToggleSidebar} />
                ) : openColorSidebar ? (
                    <ColorAddForm open={openColorSidebar} addInstantCreate={handleColorInstantAdd} colorName={colorName} toggleSidebar={colorToggleSidebar} />
                ) : openStatusSidebar ? (
                    <StatusAddForm open={openStatusSidebar} addInstantCreate={handleStatusInstantAdd} statusName={statusName} toggleSidebar={statusToggleSidebar} />
                ) : null
            } */}
        </div >
    );
};

export default SetStyleAddForm;
