var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import * as __typia_transform__createStandardSchema from "typia/lib/internal/_createStandardSchema.js";
import * as __typia_transform__assertGuard from "typia/lib/internal/_assertGuard.js";
import ____moose____typia from "typia";
import { OlapTable, getMooseClients, sql, ClickHouseEngines, MaterializedView } from '@514labs/moose-lib';
// Workaround for Next.js runtime where ts-patch/compiler plugin is missing
export var Events = new OlapTable('events', {
    orderByFields: ['event_time']
}, {
    version: "3.1",
    components: {
        schemas: {}
    },
    schemas: [
        {
            type: "object",
            properties: {
                transaction_id: {
                    type: "string"
                },
                event_type: {
                    type: "string"
                },
                product_id: {
                    type: "number"
                },
                customer_id: {
                    type: "string"
                },
                amount: {
                    type: "number"
                },
                quantity: {
                    type: "number"
                },
                event_time: {
                    type: "string",
                    format: "date-time"
                },
                customer_email: {
                    type: "string"
                },
                customer_name: {
                    type: "string"
                },
                product_name: {
                    type: "string"
                },
                status: {
                    type: "string"
                }
            },
            required: [
                "transaction_id",
                "event_type",
                "product_id",
                "customer_id",
                "amount",
                "quantity",
                "event_time",
                "customer_email",
                "customer_name",
                "product_name",
                "status"
            ]
        }
    ]
}, JSON.parse("[{\"name\":\"transaction_id\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"event_type\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"product_id\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"customer_id\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"amount\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"quantity\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"event_time\",\"data_type\":\"DateTime\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"customer_email\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"customer_name\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"product_name\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"status\",\"data_type\":\"String\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]}]"), {
    validate: function (data) {
        var result = (function () { var _io0 = function (input) { return "string" === typeof input.transaction_id && "string" === typeof input.event_type && "number" === typeof input.product_id && "string" === typeof input.customer_id && "number" === typeof input.amount && "number" === typeof input.quantity && input.event_time instanceof Date && "string" === typeof input.customer_email && "string" === typeof input.customer_name && "string" === typeof input.product_name && "string" === typeof input.status; }; var _vo0 = function (input, _path, _exceptionable) {
            if (_exceptionable === void 0) { _exceptionable = true; }
            return ["string" === typeof input.transaction_id || _report(_exceptionable, {
                    path: _path + ".transaction_id",
                    expected: "string",
                    value: input.transaction_id
                }), "string" === typeof input.event_type || _report(_exceptionable, {
                    path: _path + ".event_type",
                    expected: "string",
                    value: input.event_type
                }), "number" === typeof input.product_id || _report(_exceptionable, {
                    path: _path + ".product_id",
                    expected: "number",
                    value: input.product_id
                }), "string" === typeof input.customer_id || _report(_exceptionable, {
                    path: _path + ".customer_id",
                    expected: "string",
                    value: input.customer_id
                }), "number" === typeof input.amount || _report(_exceptionable, {
                    path: _path + ".amount",
                    expected: "number",
                    value: input.amount
                }), "number" === typeof input.quantity || _report(_exceptionable, {
                    path: _path + ".quantity",
                    expected: "number",
                    value: input.quantity
                }), input.event_time instanceof Date || _report(_exceptionable, {
                    path: _path + ".event_time",
                    expected: "Date",
                    value: input.event_time
                }), "string" === typeof input.customer_email || _report(_exceptionable, {
                    path: _path + ".customer_email",
                    expected: "string",
                    value: input.customer_email
                }), "string" === typeof input.customer_name || _report(_exceptionable, {
                    path: _path + ".customer_name",
                    expected: "string",
                    value: input.customer_name
                }), "string" === typeof input.product_name || _report(_exceptionable, {
                    path: _path + ".product_name",
                    expected: "string",
                    value: input.product_name
                }), "string" === typeof input.status || _report(_exceptionable, {
                    path: _path + ".status",
                    expected: "string",
                    value: input.status
                })].every(function (flag) { return flag; });
        }; var __is = function (input) { return "object" === typeof input && null !== input && _io0(input); }; var errors; var _report; return __typia_transform__createStandardSchema._createStandardSchema(function (input) {
            if (false === __is(input)) {
                errors = [];
                _report = __typia_transform__validateReport._validateReport(errors);
                (function (input, _path, _exceptionable) {
                    if (_exceptionable === void 0) { _exceptionable = true; }
                    return ("object" === typeof input && null !== input || _report(true, {
                        path: _path + "",
                        expected: "__type",
                        value: input
                    })) && _vo0(input, _path + "", true) || _report(true, {
                        path: _path + "",
                        expected: "__type",
                        value: input
                    });
                })(input, "$input", true);
                var success = 0 === errors.length;
                return success ? {
                    success: success,
                    data: input
                } : {
                    success: success,
                    errors: errors,
                    data: input
                };
            }
            return {
                success: true,
                data: input
            };
        }); })()(data);
        return {
            success: result.success,
            data: result.success ? result.data : undefined,
            errors: result.success ? undefined : result.errors
        };
    },
    assert: (function () { var _io0 = function (input) { return "string" === typeof input.transaction_id && "string" === typeof input.event_type && "number" === typeof input.product_id && "string" === typeof input.customer_id && "number" === typeof input.amount && "number" === typeof input.quantity && input.event_time instanceof Date && "string" === typeof input.customer_email && "string" === typeof input.customer_name && "string" === typeof input.product_name && "string" === typeof input.status; }; var _ao0 = function (input, _path, _exceptionable) {
        if (_exceptionable === void 0) { _exceptionable = true; }
        return ("string" === typeof input.transaction_id || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".transaction_id",
            expected: "string",
            value: input.transaction_id
        }, _errorFactory)) && ("string" === typeof input.event_type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".event_type",
            expected: "string",
            value: input.event_type
        }, _errorFactory)) && ("number" === typeof input.product_id || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".product_id",
            expected: "number",
            value: input.product_id
        }, _errorFactory)) && ("string" === typeof input.customer_id || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".customer_id",
            expected: "string",
            value: input.customer_id
        }, _errorFactory)) && ("number" === typeof input.amount || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".amount",
            expected: "number",
            value: input.amount
        }, _errorFactory)) && ("number" === typeof input.quantity || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".quantity",
            expected: "number",
            value: input.quantity
        }, _errorFactory)) && (input.event_time instanceof Date || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".event_time",
            expected: "Date",
            value: input.event_time
        }, _errorFactory)) && ("string" === typeof input.customer_email || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".customer_email",
            expected: "string",
            value: input.customer_email
        }, _errorFactory)) && ("string" === typeof input.customer_name || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".customer_name",
            expected: "string",
            value: input.customer_name
        }, _errorFactory)) && ("string" === typeof input.product_name || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".product_name",
            expected: "string",
            value: input.product_name
        }, _errorFactory)) && ("string" === typeof input.status || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".status",
            expected: "string",
            value: input.status
        }, _errorFactory));
    }; var __is = function (input) { return "object" === typeof input && null !== input && _io0(input); }; var _errorFactory; return function (input, errorFactory) {
        if (false === __is(input)) {
            _errorFactory = errorFactory;
            (function (input, _path, _exceptionable) {
                if (_exceptionable === void 0) { _exceptionable = true; }
                return ("object" === typeof input && null !== input || __typia_transform__assertGuard._assertGuard(true, {
                    method: "____moose____typia.createAssert",
                    path: _path + "",
                    expected: "__type",
                    value: input
                }, _errorFactory)) && _ao0(input, _path + "", true) || __typia_transform__assertGuard._assertGuard(true, {
                    method: "____moose____typia.createAssert",
                    path: _path + "",
                    expected: "__type",
                    value: input
                }, _errorFactory);
            })(input, "$input", true);
        }
        return input;
    }; })(),
    is: (function () { var _io0 = function (input) { return "string" === typeof input.transaction_id && "string" === typeof input.event_type && "number" === typeof input.product_id && "string" === typeof input.customer_id && "number" === typeof input.amount && "number" === typeof input.quantity && input.event_time instanceof Date && "string" === typeof input.customer_email && "string" === typeof input.customer_name && "string" === typeof input.product_name && "string" === typeof input.status; }; return function (input) { return "object" === typeof input && null !== input && _io0(input); }; })()
});
export var OverviewMetrics = new OlapTable('overview_metrics', {
    orderByFields: ['event_time'],
    engine: ClickHouseEngines.SummingMergeTree
}, {
    version: "3.1",
    components: {
        schemas: {}
    },
    schemas: [
        {
            type: "object",
            properties: {
                revenue: {
                    type: "number"
                },
                sales_count: {
                    type: "number"
                },
                customers_count: {
                    type: "number"
                },
                products_sold: {
                    type: "number"
                },
                event_time: {
                    type: "string",
                    format: "date-time"
                }
            },
            required: [
                "revenue",
                "sales_count",
                "customers_count",
                "products_sold",
                "event_time"
            ]
        }
    ]
}, JSON.parse("[{\"name\":\"revenue\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"sales_count\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"customers_count\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"products_sold\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"event_time\",\"data_type\":\"DateTime\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]}]"), {
    validate: function (data) {
        var result = (function () { var _io0 = function (input) { return "number" === typeof input.revenue && "number" === typeof input.sales_count && "number" === typeof input.customers_count && "number" === typeof input.products_sold && input.event_time instanceof Date; }; var _vo0 = function (input, _path, _exceptionable) {
            if (_exceptionable === void 0) { _exceptionable = true; }
            return ["number" === typeof input.revenue || _report(_exceptionable, {
                    path: _path + ".revenue",
                    expected: "number",
                    value: input.revenue
                }), "number" === typeof input.sales_count || _report(_exceptionable, {
                    path: _path + ".sales_count",
                    expected: "number",
                    value: input.sales_count
                }), "number" === typeof input.customers_count || _report(_exceptionable, {
                    path: _path + ".customers_count",
                    expected: "number",
                    value: input.customers_count
                }), "number" === typeof input.products_sold || _report(_exceptionable, {
                    path: _path + ".products_sold",
                    expected: "number",
                    value: input.products_sold
                }), input.event_time instanceof Date || _report(_exceptionable, {
                    path: _path + ".event_time",
                    expected: "Date",
                    value: input.event_time
                })].every(function (flag) { return flag; });
        }; var __is = function (input) { return "object" === typeof input && null !== input && _io0(input); }; var errors; var _report; return __typia_transform__createStandardSchema._createStandardSchema(function (input) {
            if (false === __is(input)) {
                errors = [];
                _report = __typia_transform__validateReport._validateReport(errors);
                (function (input, _path, _exceptionable) {
                    if (_exceptionable === void 0) { _exceptionable = true; }
                    return ("object" === typeof input && null !== input || _report(true, {
                        path: _path + "",
                        expected: "__type",
                        value: input
                    })) && _vo0(input, _path + "", true) || _report(true, {
                        path: _path + "",
                        expected: "__type",
                        value: input
                    });
                })(input, "$input", true);
                var success = 0 === errors.length;
                return success ? {
                    success: success,
                    data: input
                } : {
                    success: success,
                    errors: errors,
                    data: input
                };
            }
            return {
                success: true,
                data: input
            };
        }); })()(data);
        return {
            success: result.success,
            data: result.success ? result.data : undefined,
            errors: result.success ? undefined : result.errors
        };
    },
    assert: (function () { var _io0 = function (input) { return "number" === typeof input.revenue && "number" === typeof input.sales_count && "number" === typeof input.customers_count && "number" === typeof input.products_sold && input.event_time instanceof Date; }; var _ao0 = function (input, _path, _exceptionable) {
        if (_exceptionable === void 0) { _exceptionable = true; }
        return ("number" === typeof input.revenue || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".revenue",
            expected: "number",
            value: input.revenue
        }, _errorFactory)) && ("number" === typeof input.sales_count || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".sales_count",
            expected: "number",
            value: input.sales_count
        }, _errorFactory)) && ("number" === typeof input.customers_count || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".customers_count",
            expected: "number",
            value: input.customers_count
        }, _errorFactory)) && ("number" === typeof input.products_sold || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".products_sold",
            expected: "number",
            value: input.products_sold
        }, _errorFactory)) && (input.event_time instanceof Date || __typia_transform__assertGuard._assertGuard(_exceptionable, {
            method: "____moose____typia.createAssert",
            path: _path + ".event_time",
            expected: "Date",
            value: input.event_time
        }, _errorFactory));
    }; var __is = function (input) { return "object" === typeof input && null !== input && _io0(input); }; var _errorFactory; return function (input, errorFactory) {
        if (false === __is(input)) {
            _errorFactory = errorFactory;
            (function (input, _path, _exceptionable) {
                if (_exceptionable === void 0) { _exceptionable = true; }
                return ("object" === typeof input && null !== input || __typia_transform__assertGuard._assertGuard(true, {
                    method: "____moose____typia.createAssert",
                    path: _path + "",
                    expected: "__type",
                    value: input
                }, _errorFactory)) && _ao0(input, _path + "", true) || __typia_transform__assertGuard._assertGuard(true, {
                    method: "____moose____typia.createAssert",
                    path: _path + "",
                    expected: "__type",
                    value: input
                }, _errorFactory);
            })(input, "$input", true);
        }
        return input;
    }; })(),
    is: (function () { var _io0 = function (input) { return "number" === typeof input.revenue && "number" === typeof input.sales_count && "number" === typeof input.customers_count && "number" === typeof input.products_sold && input.event_time instanceof Date; }; return function (input) { return "object" === typeof input && null !== input && _io0(input); }; })()
});
export var OverViewMV = new MaterializedView({
    selectTables: [Events],
    targetTable: OverviewMetrics,
    selectStatement: sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT sum(amount) as revenue, count(*) as sales_count, uniq(customer_id) as customers_count, uniq(product_id) as products_sold, event_time FROM ", " WHERE event_type = 'purchase' GROUP BY event_time"], ["SELECT sum(amount) as revenue, count(*) as sales_count, uniq(customer_id) as customers_count, uniq(product_id) as products_sold, event_time FROM ", " WHERE event_type = 'purchase' GROUP BY event_time"])), Events),
    materializedViewName: 'overview_mv'
}, {
    version: "3.1",
    components: {
        schemas: {}
    },
    schemas: [
        {
            type: "object",
            properties: {
                revenue: {
                    type: "number"
                },
                sales_count: {
                    type: "number"
                },
                customers_count: {
                    type: "number"
                },
                products_sold: {
                    type: "number"
                },
                event_time: {
                    type: "string",
                    format: "date-time"
                }
            },
            required: [
                "revenue",
                "sales_count",
                "customers_count",
                "products_sold",
                "event_time"
            ]
        }
    ]
}, JSON.parse("[{\"name\":\"revenue\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"sales_count\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"customers_count\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"products_sold\",\"data_type\":\"Float64\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]},{\"name\":\"event_time\",\"data_type\":\"DateTime\",\"primary_key\":false,\"required\":true,\"unique\":false,\"default\":null,\"ttl\":null,\"annotations\":[]}]"));
var globalForMoose = globalThis;
export var getMoose = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (globalForMoose.mooseClient)
                    return [2 /*return*/, globalForMoose.mooseClient];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getMooseClients({
                        database: 'local',
                        host: 'localhost',
                        port: '18123',
                        username: 'panda',
                        password: 'pandapass',
                        useSSL: false
                    })];
            case 2:
                client = _a.sent();
                if (process.env.NODE_ENV !== 'production') {
                    globalForMoose.mooseClient = client;
                }
                return [2 /*return*/, client];
            case 3:
                error_1 = _a.sent();
                console.warn('Failed to connect to Moose/ClickHouse, using mock mode:', error_1);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Mock Data for Fallback
var MOCK_REVENUE = [{ total_revenue: 45231.89 }];
var MOCK_SALES = [{ total_sales: 2350 }];
var MOCK_ACTIVE = [{ active_users: 573 }];
var MOCK_REVENUE_OVER_TIME = [
    { month: '2024-01-01', revenue: 3500 },
    { month: '2024-02-01', revenue: 4500 },
    { month: '2024-03-01', revenue: 3000 },
    { month: '2024-04-01', revenue: 6000 },
    { month: '2024-05-01', revenue: 4000 },
    { month: '2024-06-01', revenue: 7500 },
    { month: '2024-07-01', revenue: 5500 },
    { month: '2024-08-01', revenue: 6500 },
    { month: '2024-09-01', revenue: 5000 },
    { month: '2024-10-01', revenue: 8000 },
    { month: '2024-11-01', revenue: 6000 },
    { month: '2024-12-01', revenue: 9000 }
];
var MOCK_RECENT_SALES = [
    {
        customer_name: 'Olivia Martin',
        customer_email: 'olivia.martin@email.com',
        amount: 1999.0,
        event_time: new Date(),
        transaction_id: '1',
        event_type: 'purchase',
        product_id: 1,
        customer_id: 'c1',
        quantity: 1,
        product_name: 'Laser Lemonade Machine',
        status: 'completed'
    },
    {
        customer_name: 'Jackson Lee',
        customer_email: 'jackson.lee@email.com',
        amount: 39.0,
        event_time: new Date(),
        transaction_id: '2',
        event_type: 'purchase',
        product_id: 2,
        customer_id: 'c2',
        quantity: 1,
        product_name: 'AeroGlow Desk Lamp',
        status: 'completed'
    },
    {
        customer_name: 'Isabella Nguyen',
        customer_email: 'isabella.nguyen@email.com',
        amount: 299.0,
        event_time: new Date(),
        transaction_id: '3',
        event_type: 'purchase',
        product_id: 3,
        customer_id: 'c3',
        quantity: 1,
        product_name: 'Hypernova Headphones',
        status: 'completed'
    },
    {
        customer_name: 'William Kim',
        customer_email: 'will@email.com',
        amount: 99.0,
        event_time: new Date(),
        transaction_id: '4',
        event_type: 'purchase',
        product_id: 4,
        customer_id: 'c4',
        quantity: 1,
        product_name: 'Terraform T-Shirt',
        status: 'completed'
    }
];
var MOCK_TOP_PRODUCTS = [
    {
        product_name: 'Laser Lemonade Machine',
        total_sales: 1234,
        total_revenue: 616987.66,
        status: 'Active'
    },
    {
        product_name: 'Hypernova Headphones',
        total_sales: 843,
        total_revenue: 109581.57,
        status: 'Active'
    },
    {
        product_name: 'AeroGlow Desk Lamp',
        total_sales: 421,
        total_revenue: 16835.79,
        status: 'Out of Stock'
    }
];
var MOCK_CUSTOMER_STATS_TOTAL = [{ total_customers: 2350 }];
var MOCK_RECENT_CUSTOMERS = [
    {
        customer_name: 'Liam Johnson',
        customer_email: 'liam@example.com',
        spent: 250.0,
        status: 'Active'
    },
    {
        customer_name: 'Emma Wilson',
        customer_email: 'emma@example.com',
        spent: 150.0,
        status: 'Active'
    },
    {
        customer_name: 'Noah Brown',
        customer_email: 'noah@example.com',
        spent: 0.0,
        status: 'Inactive'
    }
];
function executeQuery(query, fallback) {
    return __awaiter(this, void 0, void 0, function () {
        var moose, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMoose()];
                case 1:
                    moose = _a.sent();
                    if (!moose)
                        return [2 /*return*/, fallback];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, moose.client.query.execute(query)];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result.json()];
                case 4:
                    e_1 = _a.sent();
                    console.warn('Query failed, using fallback:', e_1);
                    return [2 /*return*/, fallback];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Overview Tab Queries
export var getOverviewMetrics = function () { return __awaiter(void 0, void 0, void 0, function () {
    var revenue, sales, activeUsers;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, executeQuery(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT sum(amount) as total_revenue FROM ", " WHERE event_type = 'purchase'"], ["SELECT sum(amount) as total_revenue FROM ", " WHERE event_type = 'purchase'"])), Events), MOCK_REVENUE)];
            case 1:
                revenue = _d.sent();
                return [4 /*yield*/, executeQuery(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT count(*) as total_sales FROM ", " WHERE event_type = 'purchase'"], ["SELECT count(*) as total_sales FROM ", " WHERE event_type = 'purchase'"])), Events), MOCK_SALES)];
            case 2:
                sales = _d.sent();
                return [4 /*yield*/, executeQuery(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT uniq(customer_id) as active_users FROM ", " WHERE event_time > now() - interval 1 hour"], ["SELECT uniq(customer_id) as active_users FROM ", " WHERE event_time > now() - interval 1 hour"])), Events), MOCK_ACTIVE)];
            case 3:
                activeUsers = _d.sent();
                return [2 /*return*/, {
                        totalRevenue: ((_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.total_revenue) || 0,
                        totalSales: ((_b = sales[0]) === null || _b === void 0 ? void 0 : _b.total_sales) || 0,
                        activeNow: ((_c = activeUsers[0]) === null || _c === void 0 ? void 0 : _c.active_users) || 0
                    }];
        }
    });
}); };
export var getRevenueOverTime = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, executeQuery(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      SELECT \n        toStartOfMonth(event_time) as month, \n        sum(amount) as revenue \n      FROM ", " \n      WHERE event_type = 'purchase' \n      GROUP BY month \n      ORDER BY month ASC\n    "], ["\n      SELECT \n        toStartOfMonth(event_time) as month, \n        sum(amount) as revenue \n      FROM ", " \n      WHERE event_type = 'purchase' \n      GROUP BY month \n      ORDER BY month ASC\n    "])), Events), MOCK_REVENUE_OVER_TIME)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var getRecentSales = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, executeQuery(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      SELECT * \n      FROM ", " \n      WHERE event_type = 'purchase' \n      ORDER BY event_time DESC \n      LIMIT 5\n    "], ["\n      SELECT * \n      FROM ", " \n      WHERE event_type = 'purchase' \n      ORDER BY event_time DESC \n      LIMIT 5\n    "])), Events), MOCK_RECENT_SALES)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// Products Tab Queries
export var getTopProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, executeQuery(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      SELECT \n        product_name,\n        count(*) as total_sales,\n        sum(amount) as total_revenue,\n        any(status) as status\n      FROM ", "\n      WHERE event_type = 'purchase'\n      GROUP BY product_name\n      ORDER BY total_revenue DESC\n      LIMIT 10\n    "], ["\n      SELECT \n        product_name,\n        count(*) as total_sales,\n        sum(amount) as total_revenue,\n        any(status) as status\n      FROM ", "\n      WHERE event_type = 'purchase'\n      GROUP BY product_name\n      ORDER BY total_revenue DESC\n      LIMIT 10\n    "])), Events), MOCK_TOP_PRODUCTS)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// Customers Tab Queries
export var getCustomerStats = function () { return __awaiter(void 0, void 0, void 0, function () {
    var total, recentCustomers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, executeQuery(sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["SELECT uniq(customer_id) as total_customers FROM ", ""], ["SELECT uniq(customer_id) as total_customers FROM ", ""])), Events), MOCK_CUSTOMER_STATS_TOTAL)];
            case 1:
                total = _b.sent();
                return [4 /*yield*/, executeQuery(sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      SELECT \n        customer_name, \n        customer_email, \n        sum(amount) as spent,\n        'Active' as status\n      FROM ", "\n      WHERE event_type = 'purchase'\n      GROUP BY customer_name, customer_email\n      ORDER BY spent DESC\n      LIMIT 10\n    "], ["\n      SELECT \n        customer_name, \n        customer_email, \n        sum(amount) as spent,\n        'Active' as status\n      FROM ", "\n      WHERE event_type = 'purchase'\n      GROUP BY customer_name, customer_email\n      ORDER BY spent DESC\n      LIMIT 10\n    "])), Events), MOCK_RECENT_CUSTOMERS)];
            case 2:
                recentCustomers = _b.sent();
                return [2 /*return*/, {
                        totalCustomers: ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.total_customers) || 0,
                        recentCustomers: recentCustomers
                    }];
        }
    });
}); };
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=index.js.map