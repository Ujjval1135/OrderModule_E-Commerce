import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../utils/dbConfig/index.js';

class CustomerMaster extends Model {

}

CustomerMaster.init({
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    customer_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    customer_email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
    },
    customer_address: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
}, {
    sequelize,
    paranoid: true,
    underscored: true,
    createdAt: false,
    tableName: 'customers',
    timestamps: false
});

export default CustomerMaster;