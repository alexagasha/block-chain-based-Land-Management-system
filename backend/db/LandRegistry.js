"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandTransaction = exports.Land = exports.User = void 0;
var sequelize_1 = require("sequelize");
var db_1 = require("./db"); 
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return User;
}(sequelize_1.Model));
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING(42),
        unique: true,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'user',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'users',
    timestamps: false,
});
// Lands Model
var Land = /** @class */ (function (_super) {
    __extends(Land, _super);
    function Land() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Land;
}(sequelize_1.Model));
exports.Land = Land;
Land.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ownerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    ownerName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    area: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    nin: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    deedNumber: {
        type: sequelize_1.DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    registeredAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'lands',
    timestamps: false,
});
// Land Transactions Model
var LandTransaction = /** @class */ (function (_super) {
    __extends(LandTransaction, _super);
    function LandTransaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LandTransaction;
}(sequelize_1.Model));
exports.LandTransaction = LandTransaction;
LandTransaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    landId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'lands',
            key: 'id',
        },
    },
    sellerId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    buyerId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    transactionDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    transactionHash: {
        type: sequelize_1.DataTypes.STRING(66),
    },
    remarks: {
        type: sequelize_1.DataTypes.TEXT,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'land_transactions',
    timestamps: false,
});
// Define relationships
User.hasMany(Land, { foreignKey: 'ownerId' });
Land.belongsTo(User, { foreignKey: 'ownerId' });
Land.hasMany(LandTransaction, { foreignKey: 'landId' });
LandTransaction.belongsTo(Land, { foreignKey: 'landId' });
LandTransaction.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
LandTransaction.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
