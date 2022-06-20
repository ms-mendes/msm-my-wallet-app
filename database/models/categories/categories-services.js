const sequelize = require('../../database-controller');
const { Op } = require('sequelize');
const tabCategory = require('./categories');

module.exports = {
    getAllCategories,
    getCategoriesByName,
    getCategoryById,
    insertNewCategory,
    editCategory,
    deleteCategory
};

async function getAllCategories() {
    return await tabCategory.findAll();
}

async function getCategoryById( id ) {
    const category = await tabCategory.findByPk(id);

    return category;
}

async function getCategoriesByName( categoryName ) {
    
    const categoriesList = await tabCategory.findAll( {
        where: sequelize.where( sequelize.fn('upper', sequelize.col('name')), Op.like, sequelize.fn('upper', `%${categoryName}%`) )
    });

    return categoriesList;
}

async function insertNewCategory( parameters ) {
    const category = await tabCategory.findOne({ where: { name: parameters.name,
                                                          userId: parameters.userId } });

    if ( category ) {
        return {
            error: true,
            message: `This user already have a category named ${ parameters.name }`
        }
    }
    else {
        try {
            return await tabCategory.create( parameters );
        }
        catch (e) {
            return {
                error: true,
                message: e
            };
        }
    }    
}

async function editCategory( parameters ) {
    const category = await getCategoryById( parameters.id );
    const existingCategory = await tabCategory.findOne({ where: { name: parameters.email,
                                                                  userId: parameters.userId } });
    
    if ( !category ) {
        return {
            error: true,
            message: `Category not found!`
        }
    }
    
    if ( existingCategory ) {
        return {
            error: true,
            message: `This user already have a category named ${ parameters.name }`
        }
    }
    
    const editedCategory = {
        name: parameters.name,
        transactionType: parameters.transactionType
    }

    Object.assign(category, editedCategory);
    
    return await category.save();
}

async function deleteCategory( id ) {
    const category = await getCategoryById( id );

    if ( !category ) {
        return {
            error: true,
            message: 'Category not found!'
        }
    }

    await category.destroy();
    return {message: `Category deleted successfully!`}
}