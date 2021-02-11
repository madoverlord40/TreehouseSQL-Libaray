'use strict';

const Sequelize = require('sequelize');

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Book.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '"Title" is required'
                },
                notNull: {
                    msg: 'Please provide a value for "Title"',
                },
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '"Author" is required'
                },
                notNull: {
                    msg: 'Please provide a value for "Author"',
                },
            }
        },
        genre: { type: Sequelize.STRING },
        year: { type: Sequelize.INTEGER }
    }, {
        sequelize,
        modelName: 'Book',
    });
    return Book;
};