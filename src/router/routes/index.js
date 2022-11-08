import { anonymousRoutes } from './anonymousRoutes';
import { authRoutes } from './authRoutes';
import { inventoryRoutes } from "./inventoryRoutes";
import { merchandisingReportingRoutes } from "./merchandisingReportingRoutes";
import { merchandisingRoutes } from "./merchandisingRoutes";

const baseModule = localStorage.getItem( 'module' );

// ** Document title
const TemplateTitle = '%s - ERP';

// ** Default Route
// const DefaultRoute = `/home`;
const baseRoute = baseModule === "Merchandising" ? "/merchandising" : baseModule === "Inventory" ? "/inventory" : baseModule === "Users" ? "/auth" : "";
const Routes = baseModule === "Merchandising" ? [...merchandisingRoutes, ...anonymousRoutes, ...merchandisingReportingRoutes] : baseModule === "Inventory" ? [...inventoryRoutes, ...anonymousRoutes] : baseModule === "Users" ? [...authRoutes, ...anonymousRoutes] : [...anonymousRoutes];

const DefaultRoute = `/home`;

// ** Merge Routes
// const Routes = [
//   ...authRoutes,
//   ...inventoryRoutes,
//   ...merchandisingRoutes,
//   ...productionRoutes
// ];

export { DefaultRoute, TemplateTitle, Routes, baseRoute };
