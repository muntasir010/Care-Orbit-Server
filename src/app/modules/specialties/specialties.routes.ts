import express, { type NextFunction, type Request, type Response } from 'express';
import { fileUploader } from '../../helper/fileUploader';
import { SpecialtiesValidation } from './specialties.validation';
import { SpecialtiesController } from './specialties.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get(
    '/',
    SpecialtiesController.getAllFromDB
);

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.insertIntoDB(req, res, next)
    }
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;