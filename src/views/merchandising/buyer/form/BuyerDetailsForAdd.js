import React, { useState } from 'react';
import { Codesandbox, Feather, MapPin, Maximize, User } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { bindBuyerBasicInfo } from '../store/actions';
import BuyerAgentForm from './BuyerAgentForm';
import BuyerColorForm from './BuyerColorForm';
import BuyerDepartmentForm from './BuyerDepartmentForm';
import BuyerDestinationForm from './BuyerDestinationForm';
import BuyerProductDeveloperForm from './BuyerProductDeveloperForm';
import BuyerSizeGroupForm from './BuyerSizeGroupForm';


const BuyerDetailsForAdd = () => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );


    const [active, setActive] = useState( '1' );


    const handleDropdown = ( data, e ) => {
        const { buyerDepartment, buyerAgent, buyerProductDeveloper, buyerSizeGroups, buyerColors, buyerDestinations } = buyerBasicInfo;
        const { action, name, option } = e;
        const updatedObj = {
            ...buyerBasicInfo,
            [name]: name === "buyerDepartment" ? [
                ...buyerDepartment, ...data.map( i => ( {
                    id: i.value,
                    name: i.label,
                    description: i.description,
                    isNew: true,
                    isDeleted: false
                } ) )
            ] : name === "buyerAgent" ? [
                ...buyerAgent, ...data.map( i => ( {
                    id: i.value,
                    name: i.label,
                    email: i.email,
                    phoneNumber: i.phoneNumber,
                    isNew: true,
                    isDeleted: false
                } ) )
            ] : name === "buyerProductDeveloper" ? [
                ...buyerProductDeveloper, ...data.map( i => ( {
                    id: i.value,
                    name: i.label,
                    email: i.email,
                    phoneNumber: i.phoneNumber,
                    isNew: true,
                    isDeleted: false
                } ) )
            ] : name === "buyerSizeGroups" ? [
                ...buyerSizeGroups, ...data.map( i => ( {
                    id: i.value,
                    name: i.label,
                    isNew: true,
                    isDeleted: false
                } ) )
            ] : name === "buyerColors" ? [
                ...buyerColors, ...data.map( i => ( {
                    id: i.value,
                    name: i.label,
                    isNew: true,
                    isDeleted: false
                } ) )
            ] : name === "buyerDestinations" ? [
                ...buyerDestinations, ...data.map( i => ( {
                    id: i.value,
                    name: i.label,
                    isNew: true,
                    isDeleted: false
                } ) )
            ] : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };


    const handleRemoveBuyerSizeGroupFromTable = ( id ) => {
        const { buyerSizeGroups } = buyerBasicInfo;

        const updatedBuyerSizeGroups = buyerSizeGroups.map( d => {
            if ( id === d.id ) {
                d['isDeleted'] = true;
            }
            return d;
        } );
        const updatedObj = {
            ...buyerBasicInfo,
            buyerSizeGroups: updatedBuyerSizeGroups
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };

    const handleRemoveBuyerColorFromTable = ( id ) => {
        const { buyerColors } = buyerBasicInfo;
        const updatedBuyerColors = buyerColors.map( d => {
            if ( id === d.id ) {
                d['isDeleted'] = true;
            }
            return d;
        } );

        const updatedObj = {
            ...buyerBasicInfo,
            buyerColors: updatedBuyerColors
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };


    const handleRemoveBuyerDepartmentFromTable = ( id ) => {
        const { buyerDepartment } = buyerBasicInfo;
        const updatedBuyerDepartment = buyerDepartment.map( d => {
            if ( id === d.id ) {
                d['isDeleted'] = true;
            }
            return d;
        } );

        const updatedObj = {
            ...buyerBasicInfo,
            buyerDepartment: updatedBuyerDepartment
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );

    };

    const handleRemoveBuyerAgentFromTable = ( id ) => {
        const { buyerAgent } = buyerBasicInfo;
        const updatedBuyerAgent = buyerAgent.map( d => {
            if ( id === d.id ) {
                d['isDeleted'] = true;
            }
            return d;
        } );
        const updatedObj = {
            ...buyerBasicInfo,
            buyerAgent: updatedBuyerAgent
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };


    const handleRemoveBuyerProductDeveloperFromTable = ( id ) => {
        const { buyerProductDeveloper } = buyerBasicInfo;

        const updatedProductDeveloper = buyerProductDeveloper.map( d => {
            if ( id === d.id ) {
                d['isDeleted'] = true;
            }
            return d;
        } );
        const updatedObj = {
            ...buyerBasicInfo,
            buyerProductDeveloper: updatedProductDeveloper
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };
    const handleRemoveBuyerDestinationsFromTable = ( id ) => {
        const { buyerDestinations } = buyerBasicInfo;

        const updatedDestination = buyerDestinations.map( d => {
            if ( id === d.id ) {
                d['isDeleted'] = true;
            }
            return d;
        } );

        const updatedObj = {
            ...buyerBasicInfo,
            buyerDestinations: updatedDestination
        };
        console.log( updatedObj );
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };


    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };


    return (
        <React.Fragment>
            <Nav tabs >
                <NavItem>
                    <NavLink
                        active={active === '1'}
                        onClick={() => {
                            toggle( '1' );
                        }}
                    >
                        <Codesandbox size={14} />
                        Department
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '2'}
                        onClick={() => {
                            toggle( '2' );
                        }}
                    >
                        <User size={14} />
                        Agent
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        active={active === '3'}
                        onClick={() => {
                            toggle( '3' );
                        }}
                    >
                        <User size={14} />
                        Product Developer
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '4'}
                        onClick={() => {
                            toggle( '4' );
                        }}
                    >
                        <Maximize size={14} />
                        Size Group
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '5'}
                        onClick={() => {
                            toggle( '5' );
                        }}
                    >
                        <Feather size={14} />
                        Color
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '6'}
                        onClick={() => {
                            toggle( '6' );
                        }}
                    >
                        <MapPin size={14} />
                        Destination
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1' className="pr-1 pl-1">
                    <BuyerDepartmentForm
                        buyerDepartmentByBuyer={buyerBasicInfo.buyerDepartment}
                        handleDropdown={handleDropdown}
                        handleRemoveBuyerDepartmentFromTable={handleRemoveBuyerDepartmentFromTable}
                    />
                </TabPane>
                <TabPane tabId='2' className="pr-1 pl-1">
                    <BuyerAgentForm
                        handleDropdown={handleDropdown}
                        buyerAgents={buyerBasicInfo.buyerAgent}
                        handleRemoveBuyerAgentFromTable={handleRemoveBuyerAgentFromTable}
                    />
                </TabPane>
                <TabPane tabId='3' className="pr-1 pl-1">
                    <BuyerProductDeveloperForm
                        buyerProductDeveloper={buyerBasicInfo.buyerProductDeveloper}
                        handleDropdown={handleDropdown}
                        handleRemoveBuyerProductDeveloperFromTable={handleRemoveBuyerProductDeveloperFromTable}
                    />
                </TabPane>
                <TabPane tabId='4' className="pr-1 pl-1">
                    <BuyerSizeGroupForm
                        handleDropdown={handleDropdown}
                        buyerSizeGroups={buyerBasicInfo.buyerSizeGroups}
                        handleRemoveBuyerSizeGroupFromTable={handleRemoveBuyerSizeGroupFromTable}

                    />
                </TabPane>
                <TabPane tabId='5' className="pr-1 pl-1">
                    <BuyerColorForm
                        handleDropdown={handleDropdown}
                        handleRemoveBuyerColorFromTable={handleRemoveBuyerColorFromTable}
                        buyerColors={buyerBasicInfo.buyerColors}
                    />
                </TabPane>
                <TabPane tabId='6' className="pr-1 pl-1">
                    <BuyerDestinationForm
                        handleDropdown={handleDropdown}
                        handleRemoveBuyerDestinationsFromTable={handleRemoveBuyerDestinationsFromTable}
                        buyerDestinations={buyerBasicInfo.buyerDestinations}
                    />
                </TabPane>
            </TabContent>
        </React.Fragment>
    );
};
export default BuyerDetailsForAdd;