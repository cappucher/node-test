"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = exports.Comment = exports.Watchlist = exports.Listing = exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("mydb", "root", "tinwet-sabmob-9hAbsu", {
    host: "localhost",
    dialect: "mysql",
});
class User extends sequelize_1.Model {
}
exports.User = User;
class Listing extends sequelize_1.Model {
}
exports.Listing = Listing;
class Watchlist extends sequelize_1.Model {
}
exports.Watchlist = Watchlist;
class Like extends sequelize_1.Model {
}
exports.Like = Like;
class Comment extends sequelize_1.Model {
}
exports.Comment = Comment;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.BIGINT,
    },
}, {
    timestamps: false,
    sequelize,
    modelName: "User",
});
Listing.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bid: {
        type: sequelize_1.DataTypes.FLOAT(10),
        allowNull: false,
    },
    dateOfCreation: {
        type: sequelize_1.DataTypes.STRING,
    },
    dateOfFinishing: {
        type: sequelize_1.DataTypes.STRING,
    },
    creator: {
        type: sequelize_1.DataTypes.STRING,
    },
    link: {
        type: sequelize_1.DataTypes.STRING,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
    },
    finished: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    winner: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "@nobody",
    },
}, {
    timestamps: false,
    sequelize,
    modelName: "Listing",
});
Watchlist.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    listingId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    onWatchlist: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    sequelize,
    modelName: "Watchlist",
});
Comment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    listingId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    textContent: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    dateOfCreation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    creator: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Comment"
});
Like.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    commentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    liked: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
}, {
    sequelize,
    modelName: "Like"
});
//# sourceMappingURL=models.js.map