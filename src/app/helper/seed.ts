import { UserRole } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import prisma from "../shared/prisma";
import config from "../config/config";

const seedSuperAdmin = async () => {
    try {
        if (!config.super_admin.email || !config.super_admin.password) {
            console.error("Super admin credentials missing in .env file!");
            return;
        }

        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                email: config.super_admin.email
            }
        });

        if (isExistSuperAdmin) {
            console.log("Super admin already exists!")
            return;
        };

        const hashedPassword = await bcrypt.hash(
            config.super_admin.password, 
            Number(config.salt_round)
        );

        const superAdminData = await prisma.user.create({
            data: {
                email: config.super_admin.email,
                password: hashedPassword,
                role: UserRole.SUPER_ADMIN, 
                admin: {
                    create: {
                        name: "Super Admin",
                        contactNumber: "01234567890"
                    }
                }
            }
        });

        console.log("Super Admin Created Successfully!", superAdminData.email);
    }
    catch (err) {
        console.error("Error during seeding super admin:", err);
    }
    finally {
        await prisma.$disconnect();
    }
};

export default seedSuperAdmin;