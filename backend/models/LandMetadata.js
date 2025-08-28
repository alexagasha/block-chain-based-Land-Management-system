module.exports = (sequelize, DataTypes) => {
  const LandMetadata = sequelize.define("LandMetadata", {
    land_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    blockchain_id: { type: DataTypes.INTEGER, allowNull: false },
    owner_name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.TEXT, allowNull: false },
    area: { type: DataTypes.DECIMAL, allowNull: false },
    nin: { type: DataTypes.STRING, allowNull: false },
    owner_address: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.DECIMAL, allowNull: true },
    longitude: { type: DataTypes.DECIMAL, allowNull: true },
    next_of_kin_name: { type: DataTypes.STRING, allowNull: true },
    next_of_kin_phone: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "Lands",
    timestamps: false
  });
  return LandMetadata;
};
