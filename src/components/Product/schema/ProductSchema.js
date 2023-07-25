import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../utils/dbConfig/index.js';

class ProductMaster extends Model {

};

ProductMaster.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    discount_percentage: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    images: [{
        type: DataTypes.STRING,
        allowNull: true
    }],
}, {
    sequelize,
    paranoid: true,
    underscored: true,
    createdAt: false,
    tableName: 'products_iteams',
    timestamps: false
});

export default ProductMaster;