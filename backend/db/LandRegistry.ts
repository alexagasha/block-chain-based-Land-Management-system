import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './db'; 

// Interface for Users attributes
interface UserAttributes {
  id: number;
  username: string;
  passwordHash: string;
  address: string;
  role: string;
  createdAt: Date;
}

// Interface for Users creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt'> {}

// Users Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public passwordHash!: string;
  public address!: string;
  public role!: string;
  public createdAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(42),
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

// Interface for Lands attributes
interface LandAttributes {
  id: number;
  ownerId: number;
  ownerName: string;
  location: string;
  area: number;
  nin: string;
  deedNumber: string;
  registeredAt: Date;
}

// Interface for Lands creation
interface LandCreationAttributes extends Optional<LandAttributes, 'id' | 'registeredAt'> {}

// Lands Model
class Land extends Model<LandAttributes, LandCreationAttributes> implements LandAttributes {
  public id!: number;
  public ownerId!: number;
  public ownerName!: string;
  public location!: string;
  public area!: number;
  public nin!: string;
  public deedNumber!: string;
  public registeredAt!: Date;
}

Land.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    ownerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nin: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    deedNumber: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'lands',
    timestamps: false,
  }
);

// Interface for Land Transactions attributes
interface LandTransactionAttributes {
  id: number;
  landId: number;
  sellerId?: number;
  buyerId?: number;
  transactionDate: Date;
  transactionHash?: string;
  remarks?: string;
}

// Interface for Land Transactions creation
interface LandTransactionCreationAttributes
  extends Optional<LandTransactionAttributes, 'id' | 'transactionDate' | 'sellerId' | 'buyerId' | 'transactionHash' | 'remarks'> {}

// Land Transactions Model
class LandTransaction
  extends Model<LandTransactionAttributes, LandTransactionCreationAttributes>
  implements LandTransactionAttributes {
  public id!: number;
  public landId!: number;
  public sellerId?: number;
  public buyerId?: number;
  public transactionDate!: Date;
  public transactionHash?: string;
  public remarks?: string;
}

LandTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    landId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lands',
        key: 'id',
      },
    },
    sellerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    buyerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    transactionHash: {
      type: DataTypes.STRING(66),
    },
    remarks: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'land_transactions',
    timestamps: false,
  }
);

// Define relationships
User.hasMany(Land, { foreignKey: 'ownerId' });
Land.belongsTo(User, { foreignKey: 'ownerId' });
Land.hasMany(LandTransaction, { foreignKey: 'landId' });
LandTransaction.belongsTo(Land, { foreignKey: 'landId' });
LandTransaction.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
LandTransaction.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });

export { User, Land, LandTransaction };