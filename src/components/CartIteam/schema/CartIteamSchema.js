import { Model, DataTypes, INTEGER } from 'sequelize';
import sequelize from '../../../utils/dbConfig/index.js';
import { ProductMaster } from '../../Product/schema/index.js';

class CartIteamMaster extends Model {

}

CartIteamMaster.init({
    id_: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,


    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products_items',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // created_at: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    //     defaultValue: DataTypes.NOW,
    // },
    // updated_at: {
    //     type: DataTypes.DATE,
    //     allowNull: true,
    //     defaultValue: DataTypes.NOW
    // },

}, {
    sequelize,
    paranoid: true,
    underscored: true,
    createdAt: false,
    tableName: 'cart',
    timestamps: false
});


CartIteamMaster.belongsTo(ProductMaster, {
    foreignKey: 'product_id',
    sourceKey: 'id'
})



export default CartIteamMaster;