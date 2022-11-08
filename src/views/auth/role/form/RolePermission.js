import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/auth/form/permission-form.scss';
import _ from 'lodash';
import { Fragment, useState } from 'react';
import { MinusSquare, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import CustomModal from '../../../../utility/custom/CustomModal';
import { bindPermissions } from '../../permission/store/actions';
import { assignRolePermissions, bindRolePermissions, openRolePermissionModal } from '../store/actions';

const RolePermission = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { permissions } = useSelector( ( { permissions } ) => permissions );
    const { rolePermissions, role, isRoleDataSubmitProgress } = useSelector( ( { roles } ) => roles );

    const [active, setActive] = useState( 'Merchandising' );
    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    const handleOpenSubModulePermission = ( subModule, isExpanded ) => {
        const updatedPermission = permissions.map( p => ( {
            ...p,
            subModules: p.subModules.map( sm => {
                if ( sm.name === subModule ) {
                    sm['isExpanded'] = !isExpanded;
                }
                return sm;
            } )
        } ) );
        dispatch( bindPermissions( updatedPermission ) );
    };
    const handleSubAllPermission = ( module, subModule, e ) => {
        const definePermissions = subModule?.permissions.map( p => ( {
            ...p,
            module: module.module,
            subModule: subModule.name
        } ) );
        const { checked } = e.target;
        if ( checked ) {
            const otherSubModulePermissions = rolePermissions.filter( permission => permission.code.split( '.' )[0].toLowerCase() !== subModule?.name.toLowerCase() );
            const updatedRolePermission = [...otherSubModulePermissions, ...definePermissions];
            dispatch( bindRolePermissions( updatedRolePermission ) );
        } else {
            const otherSubModulePermission2 = rolePermissions.filter( permission => permission.code.split( '.' )[0].toLowerCase() !== subModule?.name.toLowerCase() );

            dispatch( bindRolePermissions( otherSubModulePermission2 ) );
        }
        const updatedPermission = permissions.map( permission => ( {
            ...permission,
            subModules: permission.subModules.map( subModule => {
                if ( subModule.name === subModule.name ) {
                    subModule['isAll'] = checked;
                }
                return subModule;
            } )
        } ) );

        dispatch( bindPermissions( updatedPermission ) );
    };

    const handleOperationOnChange = ( e, selectedSubModule, selectedPermission, module ) => {
        const definePermission = {
            ...selectedPermission,
            module: module.module,
            subModule: selectedSubModule
        };
        const { checked } = e.target;

        const otherSubModulePermission = rolePermissions.filter( permission => permission.code !== selectedPermission.code );


        if ( checked ) {
            const updatedRolePermissions = [...otherSubModulePermission, definePermission];
            dispatch( bindRolePermissions( updatedRolePermissions ) );

        } else {
            const updatedRolePermissions = [...otherSubModulePermission];
            dispatch( bindRolePermissions( updatedRolePermissions ) );
        }

        const updatedPermission = permissions.map( p => ( {
            ...p,
            subModules: p.subModules.map( subModule => {
                if ( subModule.name === selectedSubModule.name ) {
                    subModule['isAll'] = checked;
                }
                return subModule;
            } )
        } ) );

        dispatch( bindPermissions( updatedPermission ) );

    };

    const isAllSubModulePermissionsSelected = ( subModule ) => {
        const otherSubModulePermission = rolePermissions.filter( permission => permission.code?.includes( subModule?.name.replace( /\s/g, '' ) ) );
        const isSelected = subModule?.permissions.every( permission => otherSubModulePermission.some( rolePermission => rolePermission.code === permission.code ) );
        return isSelected;
    };


    const handleModelSubmit = () => {
        dispatch( assignRolePermissions( role.id, rolePermissions ) );
        console.log( 'rolePermissions', JSON.stringify( rolePermissions, null, 2 ) );

    };
    const handleModalToggleClose = () => {
        dispatch( openRolePermissionModal( false ) );
    };

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-lg'
            openModal={openModal}
            //  setOpenModal={setOpenModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={handleModalToggleClose}
            title={`Role Permission (${role.name})`}
            isDisabledBtn={isRoleDataSubmitProgress}
        >
            <UILoader blocking={isRoleDataSubmitProgress} loader={<ComponentSpinner />} overlayColor='rgba(115, 103, 240, 1)' >
                <div className='permission'>
                    {/* <div className='divider divider-left mt-0'>
                    <div className='divider-text text-secondary font-weight-bolder '> Role Permission</div>
                </div> */}
                    <div className="border  p-1 ">
                        <div className='nav-vertical'>
                            <Nav tabs className='nav-left module'>
                                {permissions.map( ( permission, index ) => (
                                    <NavItem key={index + 1}>
                                        <NavLink
                                            active={active === permission?.module}
                                            onClick={() => {
                                                toggle( permission?.module );
                                            }}
                                        >
                                            {_.startCase( permission?.module ).toUpperCase()}
                                        </NavLink>
                                    </NavItem>
                                ) )}


                            </Nav>
                            <TabContent activeTab={active}>
                                <TabPane tabId={active}>
                                    <div>
                                        {
                                            permissions.filter( permission => permission.module === active ).map( ( module, index ) => (
                                                <Fragment key={index + 1}>
                                                    {module.subModules.map( ( subModule, index ) => (
                                                        <ul key={index + 1} className="font-weight-bolder">

                                                            <li>
                                                                <div className='d-flex  '>
                                                                    <span className='mr-2'>
                                                                        <PlusSquare
                                                                            color='green'
                                                                            hidden={subModule.isExpanded}
                                                                            onClick={() => { handleOpenSubModulePermission( subModule.name, subModule.isExpanded ); }}
                                                                            size={16}
                                                                        />
                                                                        <MinusSquare
                                                                            color='purple'
                                                                            hidden={!subModule.isExpanded}
                                                                            onClick={() => { handleOpenSubModulePermission( subModule.name, subModule.isExpanded ); }}
                                                                            size={16}
                                                                        />
                                                                    </span>
                                                                    <span>
                                                                        <Input type="checkbox"
                                                                            checked={isAllSubModulePermissionsSelected( subModule )}
                                                                            onChange={( e ) => { handleSubAllPermission( module, subModule, e ); }} />

                                                                    </span>
                                                                    <span>
                                                                        {_.startCase( subModule.name )}

                                                                    </span>
                                                                </div>

                                                                {subModule.isExpanded &&
                                                                    subModule.permissions.map( ( permission, index ) => (
                                                                        <ul key={index}>
                                                                            <li className='pl-1'>
                                                                                <Input
                                                                                    name={`${permission.code}`}
                                                                                    type="checkbox"
                                                                                    checked={rolePermissions.some( rolePermission => rolePermission.code === permission?.code )}
                                                                                    onChange={( e ) => { handleOperationOnChange( e, subModule.name, permission, module ); }} />
                                                                                {/* <label onClick={( e ) => { handleOperationOnChange( e, subModule.name, permission ); }}> {permission.code.split( "." )[1].toUpperCase()}</label> */}
                                                                                {_.startCase( permission.code.split( "." )[1] )}
                                                                            </li>
                                                                        </ul>
                                                                    ) )
                                                                }

                                                            </li>
                                                        </ul>
                                                    ) )}
                                                </Fragment>
                                            ) )
                                        }

                                    </div>
                                </TabPane>

                            </TabContent>
                        </div>
                    </div >
                </div >
            </UILoader>
        </CustomModal >
    );
};

export default RolePermission;