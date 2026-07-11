import express from "express";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";
import { PatientRoutes } from "../modules/patients/patients.routes";
import { AppointmentRoutes } from "../modules/appointment/appointment.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SchedulesRoutes } from "../modules/schedule/schedule.routes";
import { PrescriptionRoutes } from "../modules/prescription/prescription.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { MetaRoutes } from "../modules/meta/meta.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/schedule",
    route: SchedulesRoutes,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/meta",
    route: MetaRoutes,
  }
];

moduleRoutes.forEach((module) => {
  router.use(module.path, module.route);
});

export default router;
