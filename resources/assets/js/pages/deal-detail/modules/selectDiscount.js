import { track } from 'services';

const namespace = 'DEAL_DETAILS_ROLES';

const SELECT_DMR_DISCOUNT = `${namespace}_SELECT_DMR_DISCOUNT`;
const SELECT_EMPLOYEE_DISCOUNT = `${namespace}_SELECT_EMPLOYEE_DISCOUNT`;
const SELECT_SUPPLIER_DISCOUNT = `${namespace}_SELECT_SUPPLIER_DISCOUNT`;
const SELECT_CONDITIONAL_ROLES = `${namespace}_SELECT_CONDITIONAL_ROLES`;

const initialState = {
    // TODO rename to primary role
    discountType: 'dmr',
    conditionalRoles: [],
    employeeBrand: null,
    supplierBrand: null,
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case SELECT_DMR_DISCOUNT:
            return {
                ...state,
                discountType: 'dmr',
            };
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
        case SELECT_CONDITIONAL_ROLES:
            return {
                ...state,
                conditionalRoles: action.data,
            };

        default:
            return state;
    }
}

export function selectDmrDiscount() {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'default',
    });

    return {
        type: SELECT_DMR_DISCOUNT,
    };
}
export function selectEmployeeDiscount(make) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'employee',
    });

    return {
        type: SELECT_EMPLOYEE_DISCOUNT,
        make,
    };
}
export function selectSupplierDiscount(make) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'supplier',
    });

    return {
        type: SELECT_SUPPLIER_DISCOUNT,
        make,
    };
}

export function selectConditionalRoles(roles) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Conditional Roles',
        'Form Value': roles,
    });

    return {
        type: SELECT_CONDITIONAL_ROLES,
        data: roles,
    };
}
