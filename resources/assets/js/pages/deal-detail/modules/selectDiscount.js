const SELECT_DMR_DISCOUNT =
    'dmr/dealDetails.selectDiscount.SELECT_DMR_DISCOUNT';
const SELECT_EMPLOYEE_DISCOUNT =
    'dmr/dealDetails.selectDiscount.SELECT_EMPLOYEE_DISCOUNT';
const SELECT_SUPPLIER_DISCOUNT =
    'dmr/dealDetails.selectDiscount.SELECT_SUPPLIER_DISCOUNT';

const initialState = {
    discountType: 'dmr',
    employeeBrand: null,
    supplierBrand: null,
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case SELECT_DMR_DISCOUNT:
            return { ...state, discountType: 'dmr' };
        case SELECT_EMPLOYEE_DISCOUNT:
            return {
                ...state,
                discountType: 'employee',
                employeeBrand: action.make,
            };
        case SELECT_SUPPLIER_DISCOUNT:
            return {
                ...state,
                discountType: 'supplier',
                supplierBrand: action.make,
            };
        default:
            return state;
    }
}

export function selectDmrDiscount() {
    return {
        type: SELECT_DMR_DISCOUNT,
    };
}
export function selectEmployeeDiscount(make) {
    return {
        type: SELECT_EMPLOYEE_DISCOUNT,
        make,
    };
}
export function selectSupplierDiscount(make) {
    return {
        type: SELECT_SUPPLIER_DISCOUNT,
        make,
    };
}
