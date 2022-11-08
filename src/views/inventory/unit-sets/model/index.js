import { randomIdGenerator } from "../../../../utility/Utils";

export const unitSetUnits = [
    {
        id: randomIdGenerator(),
        unitCode: 'g',
        unitDescription: 'gram',
        factor: 1,
        isBaseUnit: true,
        isEdit: false
    },
    {
        id: randomIdGenerator(),
        unitCode: 'mg',
        unitDescription: 'milligram',
        factor: 1000,
        isBaseUnit: false,
        isEdit: false
    },
    {
        id: randomIdGenerator(),
        unitCode: 'kg',
        unitDescription: 'kilogram',
        factor: 0.001,
        isBaseUnit: false,
        isEdit: false

    }
];
export const units =
{
    id: randomIdGenerator(),
    unitCode: '',
    unitDescription: '',
    factor: 0,
    isBaseUnit: false,
    isEdit: false
};
