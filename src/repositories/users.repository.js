export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findByEmail = async (email) => {
    return await this.prisma.users.findFirst({ where: { email } });
  };

  signup = async (email, password, name) => {
    const newUser = await this.prisma.users.create({
      data: {
        email,
        password,
        name,
      },
      select: { userId: true, email: true, name: true },
    });
    return newUser;
  };

  findUserById = async (userId) => {
    const user = await this.prisma.users.findUnique({
      where: {
        userId: +userId,
      },
    });
    return user;
  };

  deleteUserById = async (userId) => {
    const deleteUser = await this.prisma.users.delete({
      where: {
        userId: +userId,
      },
    });
    return deleteUser;
  };
}
