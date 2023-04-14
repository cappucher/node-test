import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize("ecommercedb_l6yz", "cappucher", "24vpJNRk504kY06GnK34sazfjEbdFXhI", {
    host: "postgres://cappucher:24vpJNRk504kY06GnK34sazfjEbdFXhI@dpg-cgsrr63k9u58arku7ag0-a/ecommercedb_l6yz",
    port: 5432,
    dialect: "postgres",
});


class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
}
class Listing extends Model { 
    public id!: number;
    public title!: string;
    public description!: string
    public bid!: number;
    public dateOfCreation!: string;
    public dateOfFinishing!: string;
    public creator!: string;
    public link!: string;
    public category!: string;
    public finished!: boolean;
    public winner!: string;
}
class Watchlist extends Model { 
    public userId!: number;
    public listingId!: number;
    public onWatchlist!: boolean;
}

class Like extends Model {
    public userId!: number;
    public commentId!: number;
    public liked!: boolean;
}

class Comment extends Model {
    public id!: number; 
    public userId!: number;
    public listingId!: number;
    public textContent!: string;
    public dateOfCreation!: string;
    public creator!: string;
    public likes!: number;
}


User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.BIGINT,
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: "User",
    }
);

Listing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bid: {
            type: DataTypes.FLOAT(10),
            allowNull: false,
        },
        dateOfCreation: {
            type: DataTypes.STRING,
        },
        dateOfFinishing: {
            type: DataTypes.STRING,
        },
        creator: {
            type: DataTypes.STRING,
        },
        link: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
        },
        finished: {
            type: DataTypes.BOOLEAN,
        },
        winner: {
            type: DataTypes.STRING,
            defaultValue: "@nobody",
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: "Listing",
    }
);

Watchlist.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        onWatchlist: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: "Watchlist",
    }
);

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER
        },
        listingId: {
            type: DataTypes.INTEGER
        },
        textContent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfCreation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Comment"
    }
)

Like.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        liked: {
            type: DataTypes.BOOLEAN
        },
    },
    {
        sequelize,
        modelName: "Like"
    }
)


export { User, Listing, Watchlist, Comment, Like }