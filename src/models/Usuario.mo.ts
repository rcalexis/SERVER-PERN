import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  Unique,
} from "sequelize-typescript";

@Table({ tableName: "Users" })
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare username: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
    validate: { isEmail: true },
  })
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @Default("user")
  @Column(DataType.ENUM("user", "admin"))
  declare role: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;
}

export default User;
