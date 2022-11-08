export const permissionsModel = [
    {
        module: "Merchandising",
        subModules: [
            {
                name: "Style",
                isExpanded: true,
                isAll: false,
                permissions: [
                    {
                        code: "Style.Create",
                        description: "Create Style"
                    },
                    {
                        code: "Style.Delete",
                        description: "Create Style"
                    },
                    {
                        code: "Style.Edit",
                        description: "Create Style"
                    }
                ]
            }
        ]
    },
    {
        module: "Inventory",
        subModules: [
            {
                name: "Item Group",
                isExpanded: true,
                isAll: false,
                permissions: [
                    {
                        code: "ItemGroup.Create",
                        description: "Create Style"
                    }
                ]
            }
        ]
    }
];


export const permissionsModel2 = [
    {
        module: 'Merchandising',
        subModules: [
            {
                name: 'Style',
                isAll: false,
                isExpanded: true,
                operation: {
                    create: false,
                    delete: false,
                    edit: false

                }

            },
            {
                name: 'Costing',
                isAll: false,
                isExpanded: true,
                operation:
                {
                    create: false,
                    delete: false,
                    edit: false
                }
            }
        ]
    },
    {
        module: 'Inventory',
        subModules: [
            {
                name: 'Item Group',
                isAll: false,
                isExpanded: true,
                operation:
                {
                    create: false,
                    delete: false,
                    edit: false

                }

            },
            {
                name: 'Item',
                isAll: false,
                isExpanded: true,
                operation:
                {
                    create: false,
                    delete: false,
                    edit: false

                }

            }
        ]

    }
];