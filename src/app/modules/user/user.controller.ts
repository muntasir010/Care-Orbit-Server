import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const CreatePatientController = catchAsync(async(req, res) => {
   const result = await UserService.CreatePatient(req);
  sendResponse(res,{
    statusCode: 201,
    success: true,
    message: "Patient created successfully",
    data: result
  })
})

export const UserController = {
    CreatePatientController
}