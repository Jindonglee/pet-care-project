export class authRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findUserById = async (userId) => {
    return await prisma.users.findFirst({ where: { userId } });
  };
}
